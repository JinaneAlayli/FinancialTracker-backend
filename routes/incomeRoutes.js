import express from 'express';
import { getIncomes, createIncome,updateIncome ,softDeleteIncome} from '../controllers/incomeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getIncomes);
router.post('/', verifyToken, createIncome);
router.put('/:id', verifyToken, updateIncome);
router.patch('/:id', verifyToken, softDeleteIncome);
export default router;

