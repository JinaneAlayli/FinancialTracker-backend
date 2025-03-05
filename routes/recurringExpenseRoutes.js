import express from 'express';
import { getRecurringExpenses, createRecurringExpense,updateRecurringExpense, softDeleteRecurringExpense  } from '../controllers/recurringExpenseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getRecurringExpenses);
router.post('/', verifyToken, createRecurringExpense);
router.put('/:id', verifyToken, updateRecurringExpense);
router.patch('/:id', verifyToken, softDeleteRecurringExpense);

export default router;
