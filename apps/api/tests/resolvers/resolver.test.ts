import { resolvers } from './../../src/schema/resolvers/index';
import {
  mockPrisma,
  createMockContext,
  createMockUser,
  createMockProduct,
  createMockSale,
  createMockRental,
  createMockProductFormSession,
} from '../helpers';
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  InternalServerError,
} from '../../src/utils/errors';
import { afterEach, describe, expect, it, jest } from '@jest/globals';



describe('GraphQL Resolvers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Query Resolvers', () => {
    describe('me', () => {
      it('should return user data when authenticated', async () => {
        const mockUser = createMockUser();
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);

        const result = await resolvers.Query.me({}, {}, createMockContext('1'));

        expect(result).toEqual(mockUser);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      });

      it('should throw NotFoundError when user not found', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);

        await expect(resolvers.Query.me({}, {}, createMockContext('1'))).rejects.toThrow(
          NotFoundError,
        );
      });
    });

    describe('users', () => {
      it('should return all users', async () => {
        const mockUsers = [createMockUser(), createMockUser({ id: 2 })];
        mockPrisma.user.findMany.mockResolvedValue(mockUsers);

        const result = await resolvers.Query.users({}, {}, createMockContext());

        expect(result).toEqual(mockUsers);
        expect(mockPrisma.user.findMany).toHaveBeenCalledWith({});
      });
    });

    describe('getProductsByUser', () => {
      it('should return products for a specific user', async () => {
        const mockProducts = [createMockProduct(), createMockProduct({ id: 2 })];
        mockPrisma.product.findMany.mockResolvedValue(mockProducts);

        const result = await resolvers.Query.getProductsByUser(
          {},
          { userId: '1' },
          createMockContext(),
        );

        expect(result).toEqual(mockProducts);
        expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
          where: { userId: 1, isDeleted: false },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        });
      });
    });

    describe('getProduct', () => {
      it('should return a single product', async () => {
        const mockProduct = createMockProduct();
        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

        const result = await resolvers.Query.getProduct({}, { id: '1' }, createMockContext());

        expect(result).toEqual(mockProduct);
        expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
        });
      });
    });

    describe('getAvailableProducts', () => {
      it('should return available products', async () => {
        const mockProducts = [createMockProduct()];
        mockPrisma.product.findMany.mockResolvedValue(mockProducts);

        const result = await resolvers.Query.getAvailableProducts({}, {}, createMockContext());

        expect(result).toEqual(mockProducts);
        expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
          where: { isDeleted: false, isAvailable: true },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        });
      });
    });

    describe('getMyTransactions', () => {
      it('should return user transactions when authenticated', async () => {
        const mockTransactions = {
          purchases: [createMockSale()],
          sales: [createMockSale()],
          rentalsOut: [createMockRental()],
          rentalsIn: [createMockRental()],
        };

        mockPrisma.sale.findMany
          .mockResolvedValueOnce(mockTransactions.purchases)
          .mockResolvedValueOnce(mockTransactions.sales);
        mockPrisma.rental.findMany
          .mockResolvedValueOnce(mockTransactions.rentalsOut)
          .mockResolvedValueOnce(mockTransactions.rentalsIn);

        const result = await resolvers.Query.getMyTransactions({}, {}, createMockContext('1'));

        expect(result).toEqual(mockTransactions);
      });
    });

    describe('getProductFormState', () => {
      it('should return product data when editing existing product', async () => {
        const mockProduct = createMockProduct();
        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

        const result = await resolvers.Query.getProductFormState(
          {},
          { id: 1 },
          createMockContext('1'),
        );

        expect(result).toEqual({
          step: 1,
          totalSteps: 5,
          formData: mockProduct,
        });
      });

      it('should return session data when creating new product', async () => {
        const mockSession = createMockProductFormSession();
        mockPrisma.productFormSession.findUnique.mockResolvedValue(mockSession);

        const result = await resolvers.Query.getProductFormState({}, {}, createMockContext('1'));

        expect(result).toEqual(mockSession);
      });

      it('should return default data when no session exists', async () => {
        mockPrisma.productFormSession.findUnique.mockResolvedValue(null);

        const result = await resolvers.Query.getProductFormState({}, {}, createMockContext('1'));

        expect(result).toEqual({
          step: 1,
          totalSteps: 5,
          formData: {
            title: '',
            categories: [],
            description: '',
            price: 0,
            rentPrice: 0,
            rentPeriod: 'DAILY',
          },
        });
      });
    });
  });

  describe('Mutation Resolvers', () => {
    describe('register', () => {
      it('should register a new user successfully', async () => {
        const mockUser = createMockUser();
        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue(mockUser);

        const result = await resolvers.Mutation.register(
          {},
          {
            email: 'test@example.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            address: '123 Test St',
          },
          createMockContext(),
        );

        expect(result).toEqual({
          token: 'mock_token',
          user: mockUser,
        });
      });

      it('should throw error when user already exists', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(createMockUser());

        await expect(
          resolvers.Mutation.register(
            {},
            {
              email: 'test@example.com',
              password: 'password',
              firstName: 'John',
              lastName: 'Doe',
            },
            createMockContext(),
          ),
        ).rejects.toThrow('User with this email already exists');
      });
    });

    describe('login', () => {
      it('should login user successfully', async () => {
        const mockUser = createMockUser();
        mockPrisma.user.findUnique.mockResolvedValue(mockUser);

        const result = await resolvers.Mutation.login(
          {},
          { email: 'test@example.com', password: 'password' },
          createMockContext(),
        );

        expect(result).toEqual({
          token: 'mock_token',
          user: mockUser,
        });
      });

      it('should throw error when user not found', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);

        await expect(
          resolvers.Mutation.login(
            {},
            { email: 'test@example.com', password: 'password' },
            createMockContext(),
          ),
        ).rejects.toThrow('Invalid credentials');
      });
    });

    describe('createProductStep', () => {
      it('should create/update product form session', async () => {
        const mockSession = createMockProductFormSession();
        mockPrisma.productFormSession.findUnique.mockResolvedValue(null);
        mockPrisma.productFormSession.upsert.mockResolvedValue(mockSession);

        // Mock the validation function
        const validateProductStep = jest.fn();
        jest.doMock('@teebay/validations', () => ({
          validateProductStep,
        }));

        const result = await resolvers.Mutation.createProductStep(
          {},
          {
            step: 1,
            formData: { title: 'Test Product' },
          },
          createMockContext('1'),
        );

        expect(result.step).toBe(1);
        expect(result.formData.title).toBe('Test Product');
      });

      it('should throw ValidationError for invalid step', async () => {
        await expect(
          resolvers.Mutation.createProductStep(
            {},
            { step: 0, formData: {} },
            createMockContext('1'),
          ),
        ).rejects.toThrow(ValidationError);
      });
    });

    describe('submitProductForm', () => {
      it('should create product from form session', async () => {
        const mockSession = createMockProductFormSession();
        const mockProduct = createMockProduct();

        mockPrisma.productFormSession.findUnique.mockResolvedValue(mockSession);
        mockPrisma.product.create.mockResolvedValue(mockProduct);
        mockPrisma.productFormSession.delete.mockResolvedValue(mockSession);

        // Mock validation
        const validateCompleteProduct = jest.fn().mockReturnValue(mockSession.formData);
        jest.doMock('@teebay/validations', () => ({
          validateCompleteProduct,
        }));

        const result = await resolvers.Mutation.submitProductForm({}, {}, createMockContext('1'));

        expect(result).toEqual(mockProduct);
      });

      it('should throw ValidationError when no session exists', async () => {
        mockPrisma.productFormSession.findUnique.mockResolvedValue(null);

        await expect(
          resolvers.Mutation.submitProductForm({}, {}, createMockContext('1')),
        ).rejects.toThrow(ValidationError);
      });
    });

    describe('updateProduct', () => {
      it('should update product successfully', async () => {
        const mockProduct = createMockProduct();
        const updatedProduct = { ...mockProduct, title: 'Updated Product' };

        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
        mockPrisma.product.update.mockResolvedValue(updatedProduct);

        const result = await resolvers.Mutation.updateProduct(
          {},
          { id: 1, title: 'Updated Product' },
          createMockContext('1'),
        );

        expect(result.title).toBe('Updated Product');
      });

      it('should throw NotFoundError when product not found', async () => {
        mockPrisma.product.findUnique.mockResolvedValue(null);

        await expect(
          resolvers.Mutation.updateProduct({}, { id: 1, title: 'Updated' }, createMockContext('1')),
        ).rejects.toThrow(NotFoundError);
      });

      it('should throw AuthenticationError when user not authorized', async () => {
        const mockProduct = createMockProduct({ userId: 2 });
        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

        await expect(
          resolvers.Mutation.updateProduct({}, { id: 1, title: 'Updated' }, createMockContext('1')),
        ).rejects.toThrow(AuthenticationError);
      });
    });

    describe('deleteProduct', () => {
      it('should soft delete product successfully', async () => {
        const mockProduct = createMockProduct();
        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
        mockPrisma.product.update.mockResolvedValue({
          ...mockProduct,
          isDeleted: true,
          isAvailable: false,
        });

        const result = await resolvers.Mutation.deleteProduct(
          {},
          { id: 1 },
          createMockContext('1'),
        );

        expect(result).toBe(true);
        expect(mockPrisma.product.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: { isDeleted: true, isAvailable: false },
        });
      });
    });

    describe('buyProduct', () => {
      it('should buy product successfully', async () => {
        const mockProduct = createMockProduct({ userId: 2 });
        const mockSale = createMockSale();

        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
        mockPrisma.$transaction.mockResolvedValue([mockSale, mockProduct]);

        const result = await resolvers.Mutation.buyProduct(
          {},
          { productId: 1 },
          createMockContext('1'),
        );

        expect(result).toEqual(mockSale);
      });

      it('should throw ValidationError when trying to buy own product', async () => {
        const mockProduct = createMockProduct({ userId: 1 });
        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

        await expect(
          resolvers.Mutation.buyProduct({}, { productId: 1 }, createMockContext('1')),
        ).rejects.toThrow(ValidationError);
      });
    });

    describe('rentProduct', () => {
      it('should rent product successfully', async () => {
        const mockProduct = createMockProduct({ userId: 2 });
        const mockRental = createMockRental();

        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
        mockPrisma.rental.findMany.mockResolvedValue([]);
        mockPrisma.rental.create.mockResolvedValue(mockRental);

        const result = await resolvers.Mutation.rentProduct(
          {},
          {
            productId: 1,
            fromDate: '2024-01-01',
            toDate: '2024-01-07',
          },
          createMockContext('1'),
        );

        expect(result).toEqual(mockRental);
      });

      it('should throw ValidationError when dates conflict', async () => {
        const mockProduct = createMockProduct({ userId: 2 });
        const conflictingRental = createMockRental();

        mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
        mockPrisma.rental.findMany.mockResolvedValue([conflictingRental]);

        await expect(
          resolvers.Mutation.rentProduct(
            {},
            {
              productId: 1,
              fromDate: '2024-01-01',
              toDate: '2024-01-07',
            },
            createMockContext('1'),
          ),
        ).rejects.toThrow(ValidationError);
      });
    });
  });
});
