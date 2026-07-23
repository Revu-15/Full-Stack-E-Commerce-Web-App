/**
 * @file address.validator.ts
 * @description Zod validation schemas for user address endpoints.
 */

import { z } from 'zod';

export const createAddressSchema = z.object({
  name: z.string({ required_error: 'Full name is required' }).min(2).max(100).trim(),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(7)
    .max(20)
    .trim(),
  street: z.string({ required_error: 'Street address is required' }).min(5).max(200).trim(),
  city: z.string({ required_error: 'City is required' }).min(2).max(100).trim(),
  state: z.string({ required_error: 'State is required' }).min(2).max(100).trim(),
  zip: z.string({ required_error: 'ZIP/Postal code is required' }).min(3).max(20).trim(),
  country: z.string().default('India'),
  isDefault: z.boolean().optional().default(false),
});

export type CreateAddressDto = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = createAddressSchema.partial();

export type UpdateAddressDto = z.infer<typeof updateAddressSchema>;
