import express from 'express';
import { getExpenses, createExpense, updateExpense, softDeleteExpense  } from '../controllers/expenseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', verifyToken, getExpenses);
router.post('/', verifyToken, createExpense);
router.put('/:id', verifyToken, updateExpense); 
router.patch('/:id', verifyToken, softDeleteExpense);

export default router;
