/**
 * @file address.repository.ts
 * @description Data access layer for Address entity.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export const addressRepository = {
  async findByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async findById(id: string, userId?: string) {
    return prisma.address.findFirst({
      where: { id, ...(userId && { userId }) },
    });
  },

  async create(userId: string, data: Omit<Prisma.AddressCreateInput, 'user'>) {
    // If this is the first address or isDefault is set, clear other defaults first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: { ...data, user: { connect: { id: userId } } },
    });
  },

  async update(id: string, userId: string, data: Prisma.AddressUpdateInput) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.address.delete({ where: { id } });
  },

  async setDefault(id: string, userId: string) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  },
};
