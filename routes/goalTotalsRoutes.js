import express from "express";
import { getGoalBasedTotals } from "../controllers/goalTotalsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
 
router.get("/:goalId", verifyToken, getGoalBasedTotals);

export default router;
