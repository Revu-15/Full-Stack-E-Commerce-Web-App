/**
 * @file address.controller.ts
 * @description HTTP handlers for Address endpoints.
 */

import { Request, Response } from 'express';
import { addressService } from '../services/address.service';

export async function listAddresses(req: Request, res: Response): Promise<void> {
  const addresses = await addressService.list(req.user!.userId);
  res.json({ status: 'success', data: { addresses } });
}

export async function createAddress(req: Request, res: Response): Promise<void> {
  const address = await addressService.create(req.user!.userId, req.body);
  res.status(201).json({ status: 'success', data: { address } });
}

export async function updateAddress(req: Request, res: Response): Promise<void> {
  const address = await addressService.update(req.user!.userId, req.params.id, req.body);
  res.json({ status: 'success', data: { address } });
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  const result = await addressService.delete(req.user!.userId, req.params.id);
  res.json({ status: 'success', ...result });
}

export async function setDefaultAddress(req: Request, res: Response): Promise<void> {
  const address = await addressService.setDefault(req.user!.userId, req.params.id);
  res.json({ status: 'success', data: { address } });
}
