import supabase from '../config/supabaseClient.js';

const exchangeRates = {
    USD: 1, 
    EUR: 1.1, 
    LBP: 0.00066 
};
 
const convertToUSD = (amount, currency) => {
    return amount * (exchangeRates[currency] || 1);
};
 
export const getTotalAmounts = async (req, res) => {
    try { 
        const { data: fixedIncomes } = await supabase.from('income').select('*').eq('is_deleted', false);
        const { data: recurringIncomes } = await supabase.from('recurring_income').select('*').eq('is_deleted', false);
        const { data: fixedExpenses } = await supabase.from('expense').select('*').eq('is_deleted', false);
        const { data: recurringExpenses } = await supabase.from('recurring_expense').select('*').eq('is_deleted', false);
 
        const totalFixedIncome = fixedIncomes.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0);
        const totalRecurringIncome = recurringIncomes.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0);
        const totalFixedExpense = fixedExpenses.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0);
        const totalRecurringExpense = recurringExpenses.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0);

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
