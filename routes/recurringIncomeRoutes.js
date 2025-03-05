import express from 'express';
import { getRecurringIncomes, createRecurringIncome,updateRecurringIncome,softDeleteRecurringIncome } from '../controllers/recurringIncomeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getRecurringIncomes);
router.post('/', verifyToken, createRecurringIncome);
router.put('/:id', verifyToken, updateRecurringIncome); 
router.patch('/:id', verifyToken, softDeleteRecurringIncome);

export default router;
