import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { beforeEach, jest } from '@jest/globals';
import { Context } from '../src/lib/context';

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
  userId?: string;
};

export const mockPrisma: any = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(mockPrisma as DeepMockProxy<PrismaClient>);
});

export const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  address: '123 Test St',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  password: 'hashed_password',
  ...overrides,
});

export const createMockProduct = (overrides = {}) => ({
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  price: 100.0,
  rentPrice: 10.0,
  rentPeriod: 'DAILY' as const,
  categories: ['ELECTRONICS' as const],
  userId: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  isDeleted: false,
  isAvailable: true,
  user: createMockUser(),
  ...overrides,
});

export const createMockSale = (overrides = {}) => ({
  id: 1,
  productId: 1,
  buyerId: 2,
  sellerId: 1,
  createdAt: new Date('2024-01-01'),
  product: createMockProduct(),
  ...overrides,
});

export const createMockRental = (overrides = {}) => ({
  id: 1,
  productId: 1,
  lenderId: 1,
  borrowerId: 2,
  fromDate: new Date('2024-01-01'),
  toDate: new Date('2024-01-07'),
  createdAt: new Date('2024-01-01'),
  product: createMockProduct(),
  ...overrides,
});

export const createMockProductFormSession = (overrides = {}) => ({
  id: 'uuid-1',
  userId: 1,
  step: 1,
  formData: {
    title: 'Test Product',
    categories: ['ELECTRONICS'],
    description: 'Test description',
    price: 100,
    rentPrice: 10,
    rentPeriod: 'DAILY',
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockContext = (userId?: string): Context => ({
  prisma: mockPrisma,
  userId: userId || '1',
});

export const ProductSchema = {};
export const validateCompleteProduct = jest.fn();
export const validateProductStep = jest.fn();
