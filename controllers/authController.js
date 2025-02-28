import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';
 
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
 
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('admin').insert([
        { name, email, password: hashedPassword, role: 'admin' }
    ]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Admin registered successfully' });
};
 
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(" Received Login Request:", { email, password });

    const { data: user, error } = await supabase.from('admin').select('id, name, email, password, role').eq('email', email).single();

    if (error || !user) {
        console.log(" User not found or Supabase error:", error);
        return res.status(400).json({ error: 'Invalid Credentials' });
    }

    console.log("Found User:", user);
    console.log("Hashed Password from DB:", user.password);

    const validPass = await bcrypt.compare(password, user.password);
    console.log("Password Match Result:", validPass);

    if (!validPass) {
        
        return res.status(400).json({ error: 'Invalid Credentials' });
    }
 
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
 
    res.json({ token, role: user.role });
};
