import express from 'express';
import { getRecurringExpenses, createRecurringExpense } from '../controllers/recurringExpenseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getRecurringExpenses);
router.post('/', verifyToken, createRecurringExpense);

export default router;
