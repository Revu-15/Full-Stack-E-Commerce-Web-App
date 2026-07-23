/**
 * @file address.routes.ts
 * @description Routes for User Address endpoints. All routes require authentication.
 *
 *   GET    /addresses              — List user's addresses
 *   POST   /addresses              — Create a new address
 *   PATCH  /addresses/:id          — Update an address
 *   DELETE /addresses/:id          — Delete an address
 *   PATCH  /addresses/:id/default  — Set address as default
 */

import { Router, IRouter } from 'express';
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/address.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAddressSchema, updateAddressSchema } from '../validators/address.validator';

const router: IRouter = Router();

router.use(protect);

router.get('/', listAddresses);
router.post('/', validate(createAddressSchema), createAddress);
router.patch('/:id', validate(updateAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);

export default router;
