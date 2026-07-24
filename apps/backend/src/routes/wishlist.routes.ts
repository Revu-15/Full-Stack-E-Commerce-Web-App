/**
 * @file wishlist.routes.ts
 * @description Express routes for wishlist.
 */

import { Router, IRouter } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller';
import { protect } from '../middlewares/auth.middleware';

const router: IRouter = Router();

router.use(protect);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
