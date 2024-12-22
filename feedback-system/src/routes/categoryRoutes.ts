import express from 'express';
import {createCategory, getCategories, getStatuses} from '../controllers/categoryController';
import {authenticateToken} from "../middleware/auth";

const router = express.Router();

router.get('/', getCategories);
router.get('/statuses', getStatuses);
router.post('/', authenticateToken, createCategory);

export default router;