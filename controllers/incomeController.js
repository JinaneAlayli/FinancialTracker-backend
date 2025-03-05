import supabase from '../config/supabaseClient.js';

export const getIncomes = async (req, res) => {
    const { data, error } = await supabase.from('income').select('*').eq('is_deleted', false);;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const createIncome = async (req, res) => {
    const { title, description, amount, currency, date_time  ,category_id } = req.body; 
    
    const { data, error } = await supabase.from('income').insert([
        { title, description, amount, currency,  date_time, category_id, admin_id: req.user.id }
    ]);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Income added successfully' });
};
 
export const updateIncome = async (req, res) => {
    const { id } = req.params;
    const { title, description, amount, currency, category_id, date_time } = req.body;

    const { error } = await supabase.from('income')
        .update({ title, description, amount, currency, category_id, date_time })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Income updated successfully' });
};
 
export const softDeleteIncome = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('income')
        .update({ is_deleted: true })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Income deleted successfully' });
};