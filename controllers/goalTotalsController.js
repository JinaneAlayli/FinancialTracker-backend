import supabase from "../config/supabaseClient.js";

export const getGoalBasedTotals = async (req, res) => {
    try {
        const goalId = parseInt(req.params.goalId);  
        
        const { data: goal, error: goalError } = await supabase
            .from("profit_goal")
            .select("*")
            .eq("id", goalId)
            .single();

        if (goalError || !goal) {
            return res.status(404).json({ msg: "Goal not found." });
        }

        const { target_date } = goal;
 
        const { data: fixedIncomes } = await supabase
            .from("income")
            .select("*")
            .eq("is_deleted", false)
            .lte("date_time", target_date);

        const { data: recurringIncomes } = await supabase
            .from("recurring_income")
            .select("*")
            .eq("is_deleted", false)
            .lte("end_date", target_date);

        const { data: fixedExpenses } = await supabase
            .from("expense")
            .select("*")
            .eq("is_deleted", false)
            .lte("date_time", target_date);

        const { data: recurringExpenses } = await supabase
            .from("recurring_expense")
            .select("*")
            .eq("is_deleted", false)
            .lte("end_date", target_date);
 
        const totalFixedIncome = fixedIncomes.reduce((sum, item) => sum + item.amount, 0);
        const totalRecurringIncome = recurringIncomes.reduce((sum, item) => sum + item.amount, 0);
        const totalFixedExpense = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
        const totalRecurringExpense = recurringExpenses.reduce((sum, item) => sum + item.amount, 0);

        const totalIncome = totalFixedIncome + totalRecurringIncome;
        const totalExpense = totalFixedExpense + totalRecurringExpense;
        const netProfit = totalIncome - totalExpense;

        res.json({
            totalFixedIncome,
            totalRecurringIncome,
            totalFixedExpense,
            totalRecurringExpense,
            totalIncome,
            totalExpense,
            netProfit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
