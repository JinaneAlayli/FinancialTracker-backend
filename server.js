import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import recurringIncomeRoutes from './routes/recurringIncomeRoutes.js';
import recurringExpenseRoutes from './routes/recurringExpenseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reportsRoutes from "./routes/reportsRoutes.js";
import profitGoalRoutes from "./routes/profitGoalRoutes.js";
import totalRoutes from './routes/totalRoutes.js';

import { verifyToken } from "./middleware/authMiddleware.js";
import { getMe } from "./controllers/authController.js";

dotenv.config();
const app = express();
app.use(cookieParser());

const port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
  }));

app.use(express.json());
app.get("/users/me", verifyToken, getMe);
app.use('/users', authRoutes);
app.use('/admins', adminRoutes);
app.use('/expenses', expenseRoutes);
app.use('/incomes', incomeRoutes);
app.use('/recurring_income', recurringIncomeRoutes);
app.use('/recurring_expense', recurringExpenseRoutes);
app.use('/categories', categoryRoutes);
app.use('/reports', reportsRoutes);
app.use("/profitgoals", profitGoalRoutes);
app.use('/totals', totalRoutes);

app.listen(port, () => {
    console.log(` Server running on port ${port}`);
});
