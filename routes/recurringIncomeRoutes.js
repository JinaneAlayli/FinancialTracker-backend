import express from 'express';
import { getRecurringIncomes, createRecurringIncome } from '../controllers/recurringIncomeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getRecurringIncomes);
router.post('/', verifyToken, createRecurringIncome);

export default router;
