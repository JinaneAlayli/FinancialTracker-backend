import supabase from '../config/supabaseClient.js';
 
export const getExpenses = async (req, res) => {
    const { data, error } = await supabase.from('expense').select('*').eq('is_deleted', false);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};
 
export const createExpense = async (req, res) => {
    const { title, description, amount, currency, category_id, date_time } = req.body;
    const { data, error } = await supabase.from('expense').insert([
        { title, description, amount, currency, category_id, date_time, admin_id: req.user.id }
    ]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Expense added successfully' });
};
 
export const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { title, description, amount, currency, category_id, date_time } = req.body;

    const { error } = await supabase.from('expense')
        .update({ title, description, amount, currency, category_id, date_time })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Expense updated successfully' });
};
 
export const softDeleteExpense = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('expense')
        .update({ is_deleted: true })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Expense deleted successfully' });
};