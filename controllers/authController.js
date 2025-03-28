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
 
    const isLocalhost = process.env.NODE_ENV === "development";  
const isRender = process.env.RENDER === "true";  
const isVercel = process.env.VERCEL === "1";  

const cookieOptions = {
    httpOnly: true,
    secure: isVercel || isRender,  
    sameSite: isVercel || isRender ? "None" : "Lax",
    maxAge: 3600000,
};

res.cookie("token", token, cookieOptions);

    

    res.json({ message: "Login successful" });
};
 
//export const logout = (req, res) => {
  //  res.clearCookie("token");
  //  res.json({ message: "Logged out successfully" });
//};

export const logout = (req, res) => {
    const isLocalhost = process.env.NODE_ENV === "development";  
    const isRender = process.env.RENDER === "true";  
    const isVercel = process.env.VERCEL === "1";  

    const cookieOptions = {
        httpOnly: true,
        secure: isVercel || isRender,  
        sameSite: isVercel || isRender ? "None" : "Lax",
    };

    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out successfully" });
};

 
export const getMe = async (req, res) => {
  try {
      const { id } = req.user;  
      const { data, error } = await supabase
          .from("admin")
          .select("id, name, email, role")
          .eq("id", id)
          .single();

      if (error) return res.status(500).json({ error: "User not found" });

      res.json(data);
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
};