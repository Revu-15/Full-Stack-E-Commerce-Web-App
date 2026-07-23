/**
 * @file review.controller.ts
 * @description HTTP handlers for Review endpoints.
 */

import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export async function listReviews(req: Request, res: Response): Promise<void> {
  const page = parseInt(String(req.query.page ?? '1'));
  const limit = parseInt(String(req.query.limit ?? '10'));
  const result = await reviewService.list(req.params.productId, page, limit);
  res.json({ status: 'success', data: result });
}

export async function createReview(req: Request, res: Response): Promise<void> {
  const review = await reviewService.create(req.user!.userId, req.body);
  res.status(201).json({ status: 'success', data: { review } });
}

export async function deleteReview(req: Request, res: Response): Promise<void> {
  const result = await reviewService.delete(req.user!.userId, req.params.id);
  res.json({ status: 'success', ...result });
}
