import express from 'express';
import { getIncomes, createIncome } from '../controllers/incomeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getIncomes);
router.post('/', verifyToken, createIncome);
export default router;

