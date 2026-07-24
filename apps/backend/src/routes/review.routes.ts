/**
 * @file review.routes.ts
 * @description Express routes for product reviews.
 */

import { Router, IRouter } from 'express';
import { listReviews, createReview, deleteReview } from '../controllers/review.controller';
import { protect } from '../middlewares/auth.middleware';

const router: IRouter = Router({ mergeParams: true });

router.get('/', listReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
