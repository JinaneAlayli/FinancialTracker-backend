const express = require('express');
const { getIncomes, createIncome, deleteIncome } = require('../controllers/incomeController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, getIncomes);
router.post('/', verifyToken, createIncome);
router.delete('/:id', verifyToken, deleteIncome);

module.exports = router;
