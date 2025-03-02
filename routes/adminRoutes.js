
import express from 'express';
import { getAdmins, deleteAdmin ,updateAdmin } from '../controllers/adminController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', verifyToken, checkRole(['super_admin']), getAdmins);
router.put("/:id", verifyToken, checkRole(["super_admin"]), updateAdmin);
router.delete('/:id', verifyToken, checkRole(['super_admin']), deleteAdmin);

export default router;
