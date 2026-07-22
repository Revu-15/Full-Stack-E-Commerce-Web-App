/**
 * @file user.repository.ts
 * @description Data access layer for User entity.
 * All direct Prisma calls for the User model are isolated here,
 * following the Repository Pattern for testability and separation of concerns.
 */

import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';

// ── Types ───────────────────────────────────────────────────────────────────

/** User fields safe to return to the client (excludes password) */
export type SafeUser = Omit<User, 'password'>;

/** Fields required to create a new user */
export type CreateUserInput = {
  name: string;
  email: string;
  password?: string;
  provider?: 'LOCAL' | 'GOOGLE';
  isVerified?: boolean;
  avatar?: string;
};

// ── Select helper — reusable safe fields selector ───────────────────────────

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  role: true,
  provider: true,
  isVerified: true,
  tokenVersion: true,
  createdAt: true,
  updatedAt: true,
  // Explicitly exclude: password
} satisfies Prisma.UserSelect;

// ── Repository ──────────────────────────────────────────────────────────────

export const userRepository = {
  /**
   * Find a user by their email address.
   * Includes the password hash for authentication comparisons.
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  /**
   * Find a user by their ID (includes password — use for internal auth only).
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  /**
   * Find a user by ID, excluding the password field.
   * Use this for any response that goes to the client.
   */
  async findByIdSafe(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    }) as Promise<SafeUser | null>;
  },

  /**
   * Create a new user record.
   */
  async create(data: CreateUserInput): Promise<SafeUser> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        provider: data.provider ?? 'LOCAL',
        isVerified: data.isVerified ?? false,
        avatar: data.avatar,
      },
      select: safeUserSelect,
    }) as Promise<SafeUser>;
  },

  /**
   * Update a user record by ID.
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<SafeUser> {
    return prisma.user.update({
      where: { id },
      data,
      select: safeUserSelect,
    }) as Promise<SafeUser>;
  },

  /**
   * Mark a user's email as verified.
   */
  async verifyEmail(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  },

  /**
   * Update a user's password hash.
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  /**
   * Increment the token version to invalidate all existing refresh tokens.
   * Used on password change and manual logout-all-devices.
   */
  async incrementTokenVersion(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  },

  /**
   * Check if an email is already registered.
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },
};
