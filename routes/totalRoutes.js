import express from 'express';
import { getTotalAmounts } from '../controllers/totalController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
 
router.get('/', verifyToken, getTotalAmounts);

export default router;
