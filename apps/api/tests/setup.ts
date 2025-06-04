import { jest } from '@jest/globals';

// quick fix
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password' as never),
  compare: jest.fn().mockResolvedValue(true as never),
}));

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

jest.mock('../src/utils/loggers.ts', () => {
  return {
    __esModule: true, // 👈 necessary for ESM default exports
    default: mockLogger,
  };
});

// Mock auth utils
jest.mock('../src/utils/auth.ts', () => ({
  generateToken: jest.fn().mockReturnValue('mock_token'),
}));

jest.mock('@teebay/validations', () => ({
  ProductSchema: { partial: () => ({ parse: jest.fn() }) },
  validateCompleteProduct: jest.fn((data) => data),
  validateProductStep: jest.fn(),
}));
// Increase timeout for async operations
jest.setTimeout(10000);