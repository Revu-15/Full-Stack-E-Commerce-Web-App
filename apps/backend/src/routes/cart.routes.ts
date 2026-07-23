/**
 * @file cart.routes.ts
 * @description Routes for Cart endpoints. All routes require authentication.
 *
 *   GET    /cart              — Get user's cart
 *   POST   /cart              — Add item to cart
 *   PATCH  /cart/:itemId      — Update item quantity
 *   DELETE /cart/:itemId      — Remove specific item
 *   DELETE /cart              — Clear entire cart
 */

import { Router, IRouter } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator';

const router: IRouter = Router();


// All cart routes require authentication
router.use(protect);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(addToCartSchema), addToCart);

/**
 * @swagger
 * /cart/{itemId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:itemId', validate(updateCartItemSchema), updateCartItem);

/**
 * @swagger
 * /cart/{itemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:itemId', removeCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/', clearCart);

export default router;
