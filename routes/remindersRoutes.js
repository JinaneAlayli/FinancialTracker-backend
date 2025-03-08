import express from "express";
import { getUpcomingTransactions } from "../controllers/remindersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, getUpcomingTransactions);

export default router;
