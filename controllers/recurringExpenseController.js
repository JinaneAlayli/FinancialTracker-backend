import supabase from '../config/supabaseClient.js';
export const getRecurringExpenses = async (req, res) => {
    const { data, error } = await supabase.from('recurring_expense').select('*').eq('is_deleted', false);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}; 

export const createRecurringExpense = async (req, res) => {
    const { title, description, amount, currency, frequency, start_date, end_date, category_id } = req.body;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
 
    if (startDate >= endDate) {
        return res.status(400).json({ msg: "Start date must be before the end date." });
    }

    const { data, error } = await supabase.from('recurring_expense').insert([
        { title, description, amount, currency, frequency, start_date, end_date, admin_id: req.user.id, category_id }
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Expense added successfully' });
};

export const updateRecurringExpense = async (req, res) => {
    const { id } = req.params;
    const { title, description, amount, currency, frequency, start_date, end_date, category_id } = req.body;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
 
    if (startDate >= endDate) {
        return res.status(400).json({ msg: "Start date must be before the end date." });
    }

    const { error } = await supabase.from('recurring_expense')
        .update({ title, description, amount, currency, frequency, start_date, end_date, category_id })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Expense updated successfully' });
};

 
export const softDeleteRecurringExpense = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('recurring_expense')
        .update({ is_deleted: true })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Recurring Expense deleted successfully' });
};
