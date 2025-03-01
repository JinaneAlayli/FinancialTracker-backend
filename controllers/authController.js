import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';
 
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const { data: existingUser, error } = await supabase.from('admin').select('email').eq('email', email).single();
    if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error: insertError } = await supabase.from('admin').insert([
        { name, email, password: hashedPassword, role: 'admin' }
    ]);

    if (insertError) return res.status(500).json({ error: insertError.message });
    res.json({ message: 'Admin registered successfully' });
};
 
export const login = async (req, res) => {
    const { email, password } = req.body; 
    const { data: user, error } = await supabase.from('admin').select('id, email, password, role').eq('email', email).single();
    if (error || !user) { 
        return res.status(400).json({ error: 'This user does not exist' });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        return res.status(400).json({ error: 'Incorrect password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
 
    res.cookie("token", token, {
        httpOnly: true, 
        secure: false,  
        sameSite: "Strict",  
        maxAge: 3600000, 
    });

    res.json({ message: "Login successful" });
};
 
export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
 
export const getMe = (req, res) => {
    res.json(req.user);
};