import supabase from '../config/supabaseClient.js';
import bcrypt from 'bcryptjs';
export const getAdmins = async (req, res) => {
    const { data, error } = await supabase.from('admin').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};
 
export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
 
    const { count: categoryCount } = await supabase.from('categories').select('*', { count: "exact" }).eq('admin_id', id);
    const { count: incomeCount } = await supabase.from('income').select('*', { count: "exact" }).eq('admin_id', id);
    const { count: expenseCount } = await supabase.from('expense').select('*', { count: "exact" }).eq('admin_id', id);
    const { count: recurringIncomeCount } = await supabase.from('recurring_income').select('*', { count: "exact" }).eq('admin_id', id);
    const { count: recurringExpenseCount } = await supabase.from('recurring_expense').select('*', { count: "exact" }).eq('admin_id', id);

    if (categoryCount || incomeCount || expenseCount || recurringIncomeCount || recurringExpenseCount) {
        return res.status(400).json({ error: "Cannot delete admin with linked data" });
    }
 
    const { error } = await supabase.from("admin").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Admin deleted successfully" });
};



export const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    let updatedFields = { name, email, role };
 
    if (password && password !== "*****") {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
    }

    const { error } = await supabase.from("admin").update(updatedFields).eq("id", id);

    if (error) { 
        return res.status(500).json({ error: error.message });
    }
 
    res.json({ message: "Admin updated successfully" });
};


