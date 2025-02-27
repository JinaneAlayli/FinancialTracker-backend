//import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';
 
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    const { data, error } = await supabase.from('admin').insert([
        { name, email, password: password, role: 'admin' } 
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Admin registered successfully' });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from('admin').select('*').eq('email', email).single();
    if (error || !user) return res.status(400).json({ error: 'Invalid Credentials' });
    if (password !== user.password) return res.status(400).json({ error: 'Invalid Credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role });
};

