import express from "express";
import { verifyToken } from '../middleware/authMiddleware.js';
import { generateReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get("/", verifyToken, generateReport); // GET /reports?filter=monthly

export default router;