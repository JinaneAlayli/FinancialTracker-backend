import supabase from '../config/supabaseClient.js';
 
export const getAdmins = async (req, res) => {
    const { data, error } = await supabase.from('admin').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};
 
export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('admin').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Admin deleted successfully' });
};
