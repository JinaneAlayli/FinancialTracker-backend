import supabase from "../config/supabaseClient.js";

// Create a profit goal
export const createProfitGoal = async (req, res) => {
    try {
        const { target_amount, currency, target_date } = req.body;
        const admin_id = req.user.id; // Assuming you get the authenticated admin's ID

        if (!target_amount || !currency || !target_date) {
            return res.status(400).json({ msg: "All fields are required." });
        }

        const { data, error } = await supabase
            .from("profit_goal")
            .insert([{ target_amount, currency, target_date, admin_id }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get all profit goals for the admin
export const getProfitGoals = async (req, res) => {
    try {
        const admin_id = req.user.id;

        const { data, error } = await supabase
            .from("profit_goal")
            .select("*");
            

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Get a single profit goal by ID
export const getProfitGoalById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("profit_goal")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ msg: "Profit goal not found." });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Update a profit goal
export const updateProfitGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { target_amount, currency, target_date } = req.body;
        const admin_id = req.user.id;

        const { data, error } = await supabase
            .from("profit_goal")
            .update({ target_amount, currency, target_date })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Delete a profit goal
export const deleteProfitGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const admin_id = req.user.id;

        const { error } = await supabase
            .from("profit_goal")
            .delete()
            .eq("id", id);

        if (error) throw error;
        res.status(200).json({ msg: "Profit goal deleted successfully." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};