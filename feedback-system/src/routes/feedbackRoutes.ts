import express from 'express';
import {
    createFeedback,
    getFeedbacks,
    updateFeedback,
    deleteFeedback
} from '../controllers/feedbackController';
import { toggleVote } from '../controllers/voteController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getFeedbacks);
router.post('/', authenticateToken, createFeedback);
router.put('/:id', authenticateToken, updateFeedback);
router.delete('/:id', authenticateToken, deleteFeedback);
router.post('/:postId/vote', authenticateToken, toggleVote);

export default router;