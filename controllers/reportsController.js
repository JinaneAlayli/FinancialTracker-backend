import supabase from "../config/supabaseClient.js"; // Import your Supabase client

export const generateReport = async (req, res) => {
    try {
        // Extract admin_id from authenticated user
        const admin_id = req.user.id;

        // Extract filter (e.g., weekly, monthly, yearly)
        const { filter } = req.query;
        let startDate;

        // Determine start date based on filter
        if (filter === "weekly") {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (filter === "monthly") {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (filter === "yearly") {
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
        } else {
            return res.status(400).json({ msg: "Invalid filter. Use weekly, monthly, or yearly." });
        }

        // Convert date to ISO string
        const formattedDate = startDate.toISOString().split("T")[0];

        // Fetch all income & expenses
        const { data: income, error: incomeError } = await supabase
            .from("income")
            .select("id, amount, date_time, category_id")
            .eq("admin_id", admin_id)
            .gte("date_time", formattedDate);

        if (incomeError) throw new Error(incomeError.message);

        const { data: expense, error: expenseError } = await supabase
            .from("expense")
            .select("id, amount, date_time, category_id")
            .eq("admin_id", admin_id)
            .gte("date_time", formattedDate);

        if (expenseError) throw new Error(expenseError.message);

        // Fetch recurring income & expenses
        const { data: recurring_income, error: recurringIncomeError } = await supabase
            .from("recurring_income")
            .select("id, amount, start_date, frequency, category_id")
            .eq("admin_id", admin_id);

        if (recurringIncomeError) throw new Error(recurringIncomeError.message);

        const { data: recurring_expense, error: recurringExpenseError } = await supabase
            .from("recurring_expense")
            .select("id, amount, start_date, frequency, category_id")
            .eq("admin_id", admin_id);

        if (recurringExpenseError) throw new Error(recurringExpenseError.message);

        // Convert recurring incomes/expenses into actual transactions
        const recurringIncomesProcessed = processRecurringTransactions(recurring_income, formattedDate);
        const recurringExpensesProcessed = processRecurringTransactions(recurring_expense, formattedDate);

        // Combine all transactions
        const allIncome = [...income, ...recurringIncomesProcessed];
        const allExpenses = [...expense, ...recurringExpensesProcessed];

        // Calculate totals
        const totalIncome = allIncome.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalExpense = allExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const netProfit = totalIncome - totalExpense;

        // Format the response
        const report = {
            filter,
            totalIncome,
            totalExpense,
            netProfit,
            transactions: {
                income: allIncome,
                expense: allExpenses,
            },
        };

        res.status(200).json(report);
    } catch (error) {
        console.error("Error generating report:", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Function to process recurring transactions
const processRecurringTransactions = (transactions, startDate) => {
    let processedTransactions = [];

    transactions.forEach((item) => {
        let transactionDate = new Date(item.start_date);
        while (transactionDate >= new Date(startDate)) {
            processedTransactions.push({
                id: item.id,
                amount: item.amount,
                date_time: transactionDate.toISOString().split("T")[0],
                category_id: item.category_id,
            });

            if (item.frequency === "daily") {
                transactionDate.setDate(transactionDate.getDate() + 1);
            } else if (item.frequency === "weekly") {
                transactionDate.setDate(transactionDate.getDate() + 7);
            } else if (item.frequency === "monthly") {
                transactionDate.setMonth(transactionDate.getMonth() + 1);
            } else if (item.frequency === "yearly") {
                transactionDate.setFullYear(transactionDate.getFullYear() + 1);
            }
        }
    });

    return processedTransactions;
};