import supabase  from '../config/supabaseClient.js';

//Get all categories
export const getCategories = async (req, res) => {
    const { data , error} = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ msg: error.message });
    res.json(data);
}

//Create a new Category
export const createCategory = async (req, res) => {
    const { name, type } = req.body;
    const adminId = 3;
    if(!name || !type){
        return res.status(400).json({msg: 'Name and type are required!' });
    }
    const { data, error} = await supabase.from('categories').insert([{name, type, admin_id: adminId }]);
    if(error) return res.status(500).json({ msg: error.message});
    res.json(data);
}

//Delete a category
export const deleteCategory = async (req, res) => {
    const{id} = req.params;
    const{error} = await supabase.from('categories').delete().eq('id',id);
    if(error) return res.status(500).json({ msg: error.message});
    res.json(data);
}