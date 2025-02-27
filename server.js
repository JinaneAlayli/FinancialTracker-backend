import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import recurringIncomeRoutes from './routes/recurringIncomeRoutes.js';
import recurringExpenseRoutes from './routes/recurringExpenseRoutes.js';
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
 
app.use('/users', authRoutes);
app.use('/admins', adminRoutes);
app.use('/expenses', expenseRoutes);
app.use('/incomes', incomeRoutes);
app.use('/recurring_income', recurringIncomeRoutes);
app.use('/recurring_expense', recurringExpenseRoutes);

app.listen(port, () => {
    console.log(` Server running on port ${port}`);
});
