import supabase from '../config/supabaseClient.js';
 
export const getExpenses = async (req, res) => {
    const { data, error } = await supabase.from('expense').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};
 
export const createExpense = async (req, res) => {
    const { title, description, amount, currency, category_id } = req.body;
    const { data, error } = await supabase.from('expense').insert([
        { title, description, amount, currency, category_id, admin_id: req.user.id }
    ]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Expense added successfully' });
};
 
export const deleteExpense = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('expense').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Expense deleted successfully' });
};
