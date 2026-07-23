/**
 * @file order.routes.ts
 * @description Routes for Order endpoints. All routes require authentication.
 *
 *   GET  /orders       — List user's orders
 *   POST /orders       — Place a new order from cart
 *   GET  /orders/:id   — Get order detail
 */

import { Router, IRouter } from 'express';
import { listMyOrders, getMyOrder, placeOrder } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { placeOrderSchema, orderQuerySchema } from '../validators/order.validator';

const router: IRouter = Router();

router.use(protect);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List the current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', validate(orderQuerySchema, 'query'), listMyOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order from the user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(placeOrderSchema), placeOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getMyOrder);

export default router;
