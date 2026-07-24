/**
 * @file wishlist.controller.ts
 * @description HTTP handlers for Wishlist endpoints.
 */

import { Request, Response } from 'express';
import { prisma } from '../config/database';

export async function getWishlist(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: { category: true, brand: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ status: 'success', data: { wishlist: items.map((i) => i.product) } });
}

export async function addToWishlist(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { productId } = req.body;

  const item = await prisma.wishlist.upsert({
    where: {
      userId_productId: { userId, productId },
    },
    create: { userId, productId },
    update: {},
    include: { product: true },
  });

  res.status(201).json({ status: 'success', data: { item } });
}

export async function removeFromWishlist(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { productId } = req.params;

  await prisma.wishlist.deleteMany({
    where: { userId, productId },
  });

  res.json({ status: 'success', message: 'Removed from wishlist' });
}
