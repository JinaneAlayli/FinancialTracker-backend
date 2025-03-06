import express from "express";
import { 
    createProfitGoal, 
    getProfitGoals, 
    getProfitGoalById, 
    updateProfitGoal, 
    deleteProfitGoal 
} from "../controllers/profitGoalController.js";
import { verifyToken } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post("/", verifyToken, createProfitGoal);
router.get("/", verifyToken, getProfitGoals);
router.get("/:id", verifyToken, getProfitGoalById);
router.put("/:id", verifyToken, updateProfitGoal);
router.delete("/:id", verifyToken, deleteProfitGoal);

export default router;