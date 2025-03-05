import supabase from "../config/supabaseClient.js";

// Generate report with optimized queries
export const generateReport = async (req, res) => {
    try {
        const admin_id = req.user.id;
        const { filter, page = 1, pageSize = 50 } = req.query;

        // Validate filter
        if (!["weekly", "monthly", "yearly"].includes(filter)) {
            return res.status(400).json({ msg: "Invalid filter. Use weekly, monthly, or yearly." });
        }

        // Set date range based on filter
        const startDate = getStartDate(filter);
        const formattedDate = startDate.toISOString().split("T")[0];

        // Fetch transactions from database
        const [income, expense, recurring_income, recurring_expense] = await Promise.all([
            fetchTransactions("income", admin_id, formattedDate, page, pageSize),
            fetchTransactions("expense", admin_id, formattedDate, page, pageSize),
            fetchRecurringTransactions("recurring_income", admin_id),
            fetchRecurringTransactions("recurring_expense", admin_id),
        ]);

        // Process recurring transactions
        const processedIncome = processRecurringTransactions(recurring_income, formattedDate);
        const processedExpense = processRecurringTransactions(recurring_expense, formattedDate);

        // Combine all transactions
        const allIncome = [...income, ...processedIncome];
        const allExpenses = [...expense, ...processedExpense];

        // Calculate totals
        const totalIncome = sumAmounts(allIncome);
        const totalExpense = sumAmounts(allExpenses);
        const netProfit = totalIncome - totalExpense;

        // Send response
        res.status(200).json({
            filter,
            totalIncome,
            totalExpense,
            netProfit,
            transactions: { income: allIncome, expense: allExpenses },
        });
    } catch (error) {
        console.error("Error generating report:", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// 🔹 Function to get the start date based on filter
const getStartDate = (filter) => {
    const startDate = new Date();
    if (filter === "weekly") startDate.setDate(startDate.getDate() - 7);
    else if (filter === "monthly") startDate.setMonth(startDate.getMonth() - 1);
    else if (filter === "yearly") startDate.setFullYear(startDate.getFullYear() - 1);
    return startDate;
};

// 🔹 Function to fetch income/expense transactions with pagination
const fetchTransactions = async (table, admin_id, startDate, page, pageSize) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error } = await supabase
        .from(table)
        .select("id, amount, date_time, category_id")
        .eq("admin_id", admin_id)
        .gte("date_time", startDate)
        .range(start, end);

    if (error) throw new Error(`Error fetching ${table}: ${error.message}`);
    return data || [];
};

// 🔹 Function to fetch recurring income/expense transactions
const fetchRecurringTransactions = async (table, admin_id) => {
    const { data, error } = await supabase
        .from(table)
        .select("id, amount, start_date, frequency, category_id")
        .eq("admin_id", admin_id);

    if (error) throw new Error(`Error fetching ${table}: ${error.message}`);
    return data || [];
};

// 🔹 Function to process recurring transactions
const processRecurringTransactions = (transactions, startDate) => {
    let processed = [];
    const today = new Date();

    transactions.forEach((item) => {
        let transactionDate = new Date(item.start_date);
        while (transactionDate >= new Date(startDate) && transactionDate <= today) {
            processed.push({
                id: item.id,
                amount: item.amount,
                date_time: transactionDate.toISOString().split("T")[0],
                category_id: item.category_id,
            });

            if (item.frequency === "daily") transactionDate.setDate(transactionDate.getDate() + 1);
            else if (item.frequency === "weekly") transactionDate.setDate(transactionDate.getDate() + 7);
            else if (item.frequency === "monthly") transactionDate.setMonth(transactionDate.getMonth() + 1);
            else if (item.frequency === "yearly") transactionDate.setFullYear(transactionDate.getFullYear() + 1);

            if (transactionDate > today) break;
        }
    });

    return processed;
};

// 🔹 Function to sum up amounts
const sumAmounts = (transactions) => {
    return transactions.reduce((sum, item) => sum + parseFloat(item.amount), 0);
};