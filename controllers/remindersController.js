import supabase from "../config/supabaseClient.js";
 
const getNextOccurrence = (startDate, frequency) => {
    let nextDate = new Date(startDate);

    while (nextDate < new Date()) {   
        if (frequency === "weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (frequency === "monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (frequency === "yearly") {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
    }

    return nextDate;
};

export const getUpcomingTransactions = async (req, res) => {
    try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
 
        const { data: recurringIncomes, error: incomeError } = await supabase
            .from("recurring_income")
            .select("*")
            .eq("is_deleted", false);
 
        const { data: recurringExpenses, error: expenseError } = await supabase
            .from("recurring_expense")
            .select("*")
            .eq("is_deleted", false);

        if (incomeError || expenseError) {
            return res.status(500).json({ error: "Error fetching reminders" });
        }
 
        const upcomingIncomes = recurringIncomes
            .map(income => {
                let nextDueDate = getNextOccurrence(income.start_date, income.frequency);
                return nextDueDate <= threeDaysLater ? { ...income, nextDueDate: nextDueDate.toISOString().split("T")[0] } : null;
            })
            .filter(income => income !== null);
 
        const upcomingExpenses = recurringExpenses
            .map(expense => {
                let nextDueDate = getNextOccurrence(expense.start_date, expense.frequency);
                return nextDueDate <= threeDaysLater ? { ...expense, nextDueDate: nextDueDate.toISOString().split("T")[0] } : null;
            })
            .filter(expense => expense !== null);

        res.json({ upcomingIncomes, upcomingExpenses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


