/**
 * @file address.service.ts
 * @description Business logic for user address management.
 */

import { addressRepository } from '../repositories/address.repository';
import { notFound, forbidden } from '../utils/AppError';
import type { CreateAddressDto, UpdateAddressDto } from '../validators/address.validator';

export const addressService = {
  async list(userId: string) {
    return addressRepository.findByUserId(userId);
  },

  async create(userId: string, dto: CreateAddressDto) {
    return addressRepository.create(userId, {
      name: dto.name,
      phone: dto.phone,
      street: dto.street,
      city: dto.city,
      state: dto.state,
      zip: dto.zip,
      country: dto.country ?? 'India',
      isDefault: dto.isDefault ?? false,
    });
  },

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await addressRepository.findById(addressId, userId);
    if (!address) throw notFound('Address not found.');
    if (address.userId !== userId) throw forbidden('You cannot modify this address.');

    return addressRepository.update(addressId, userId, dto);
  },

  async delete(userId: string, addressId: string) {
    const address = await addressRepository.findById(addressId, userId);
    if (!address) throw notFound('Address not found.');
    if (address.userId !== userId) throw forbidden('You cannot delete this address.');

    await addressRepository.delete(addressId);
    return { message: 'Address deleted successfully.' };
  },

  async setDefault(userId: string, addressId: string) {
    const address = await addressRepository.findById(addressId, userId);
    if (!address) throw notFound('Address not found.');
    if (address.userId !== userId) throw forbidden('You cannot modify this address.');

    return addressRepository.setDefault(addressId, userId);
  },
};
