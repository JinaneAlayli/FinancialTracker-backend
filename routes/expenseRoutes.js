import express from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expenseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', verifyToken, getExpenses);
router.post('/', verifyToken, createExpense);
router.delete('/:id', verifyToken, deleteExpense);

export default router;
