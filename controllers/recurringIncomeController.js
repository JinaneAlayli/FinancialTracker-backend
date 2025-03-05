import supabase from '../config/supabaseClient.js';

export const getRecurringIncomes = async (req, res) => {
    const { data, error } = await supabase.from('recurring_income').select('*').eq('is_deleted', false);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const createRecurringIncome = async (req, res) => {
    const { title, description, amount, currency, frequency, start_date, end_date, category_id } = req.body;

    const { data, error } = await supabase.from('recurring_income').insert([
        { title, description, amount, currency, frequency, start_date, end_date, admin_id: req.user.id, category_id }
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Income added successfully' });
};

export const updateRecurringIncome = async (req, res) => {
    const { id } = req.params;
    const { title, description, amount, currency, frequency, start_date, end_date, category_id } = req.body;

    const { error } = await supabase.from('recurring_income')
        .update({ title, description, amount, currency, frequency, start_date, end_date, category_id })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Income updated successfully' });
};

export const softDeleteRecurringIncome = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('recurring_income')
        .update({ is_deleted: true })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Income deleted successfully' });
};