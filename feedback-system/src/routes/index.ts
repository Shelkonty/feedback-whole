import { Router } from 'express';
import userRoutes from './userRoutes';
import feedbackRoutes from './feedbackRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/categories', categoryRoutes);

export default router;