import supabase from '../config/supabaseClient.js';

export const getRecurringExpenses = async (req, res) => {
    const { data, error } = await supabase.from('recurring_expense').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const createRecurringExpense = async (req, res) => {
    const { title, description, amount, currency, frequency, start_date, end_date, category_id } = req.body;
    const { data, error } = await supabase.from('recurring_expense').insert([
        { title, description, amount, currency, frequency, start_date, end_date, category_id, admin_id: req.user.id }
    ]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Expense added successfully' });
};
