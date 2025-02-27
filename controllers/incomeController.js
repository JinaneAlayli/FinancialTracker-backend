import supabase from '../config/supabaseClient.js';

export const getIncomes = async (req, res) => {
    const { data, error } = await supabase.from('income').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const createIncome = async (req, res) => {
    const { title, description, amount, currency, category_id } = req.body;
    const { data, error } = await supabase.from('income').insert([
        { title, description, amount, currency, category_id, admin_id: req.user.id }
    ]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Income added successfully' });
};
