import type { Context } from '../../lib/context.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/auth.js';
import {
  AuthenticationError,
  BaseError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from '../../utils/errors.js';
import {
  ProductSchema,
  validateCompleteProduct,
  validateProductResponse,
  validateProductStep,
} from '@teebay/validations';
import { logResolver } from '../../utils/logResolver.js';
import logger from '../../utils/loggers.js';

export const resolvers = {
  Query: {
    me: logResolver('Query.me', async (_: any, __: any, { prisma, userId }: Context) => {
      if (!userId) throw new AuthenticationError();

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
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

      if (!user) throw new NotFoundError('User');
      return user;
    }),

    users: logResolver('Query.users', async (_: any, __: any, { prisma }: Context) => {
      return prisma.user.findMany({});
    }),

    getProductsByUser: logResolver(
      'Query.getProductsByUser',
      async (_: any, { userId }: any, { prisma }: Context) => {
        const products = await prisma.product.findMany({
          where: { userId: parseInt(userId), isDeleted: false },
          include: { user: true },
        });

        return products;
      },
    ),

    getProduct: logResolver(
      'Query.getProduct',
      async (_: any, { id }: any, { prisma }: Context) => {
        const product = await prisma.product.findUnique({ where: { id: Number(id) } });
        return product;
      },
    ),

    getAvailableProducts: logResolver(
      'Query.getAvailableProducts',
      async (_: any, __: any, { prisma }: Context) => {
        const products = prisma.product.findMany({
          where: { isDeleted: false, isAvailable: true },
          include: { user: true },
        });
        return products;
      },
    ),

    getMyTransactions: logResolver(
      'Query.getMyTransactions',
      async (_: any, __: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        const id = parseInt(userId);
        const results = {
          purchases: await prisma.sale.findMany({
            where: { buyerId: id },
            include: {
              product: true,
            },
          }),
          sales: await prisma.sale.findMany({
            where: { sellerId: id },
            include: {
              product: true,
            },
          }),
          rentalsOut: await prisma.rental.findMany({
            where: { lenderId: id },
            include: {
              product: true,
            },
          }),
          rentalsIn: await prisma.rental.findMany({
            where: { borrowerId: id },
            include: {
              product: true,
            },
          }),
        };

        console.log(results);

        return results;
      },
    ),

    getProductFormState: logResolver(
      'Query.getProductFormState',
      async (_: any, { id }: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        if (id) {
          const product = await prisma.product.findUnique({ where: { id } });
          if (!product) throw new NotFoundError('Product');
          return { step: 1, totalSteps: 5, formData: product };
        }

        const session = await prisma.productFormSession.findUnique({
          where: { userId: parseInt(userId) },
        });

        return (
          session || {
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
          }
        );
      },
    ),
  },

  Mutation: {
    register: logResolver(
      'Mutation.register',
      async (_parent: any, args: any, { prisma }: Context) => {
        const { email, password, firstName, lastName, phone, address } = args;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('User with this email already exists');

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            email,
            password: hashed,
            firstName,
            lastName,
            phone,
            address,
          },
        });

        const token = generateToken(user.id.toString());
        return { token, user };
      },
    ),

    login: logResolver(
      'Mutation.login',
      async (_: any, { email, password }: any, { prisma }: Context) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        const token = generateToken(user.id?.toString());
        return { token, user };
      },
    ),

    createProductStep: logResolver(
      'Mutation.createProductStep',
      async (_: any, { step, formData }: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();
        if (step < 1 || step > 5) throw new ValidationError('Invalid step number');

        validateProductStep(step, formData);

        const existingSession = await prisma.productFormSession.findUnique({
          where: { userId: parseInt(userId) },
        });

        const updatedSession = {
          step,
          formData: {
            ...(typeof existingSession?.formData === 'object' && existingSession?.formData !== null
              ? existingSession.formData
              : {
                  title: '',
                  categories: [],
                  description: '',
                  price: 0,
                  rentPrice: 0,
                  rentPeriod: 'DAILY',
                }),
            ...formData,
          },
        };

        await prisma.productFormSession.upsert({
          where: { userId: parseInt(userId) },
          create: {
            userId: parseInt(userId),
            step,
            formData: updatedSession.formData,
          },
          update: {
            step,
            formData: updatedSession.formData,
          },
        });

        return updatedSession;
      },
    ),

    submitProductForm: logResolver(
      'Mutation.submitProductForm',
      async (_: any, __: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        const session = await prisma.productFormSession.findUnique({
          where: { userId: parseInt(userId) },
        });
        if (!session) throw new ValidationError('No product form in progress');

        const productData = validateCompleteProduct(session.formData);

        try {
          const product = await prisma.product.create({
            data: {
              title: productData.title,
              description: productData.description,
              price: productData.price,
              rentPrice: productData.rentPrice,
              rentPeriod: productData.rentPeriod,
              userId: parseInt(userId),
              categories: productData.categories,
            },
          });

          await prisma.productFormSession.delete({
            where: { userId: parseInt(userId) },
          });

          return product;
        } catch (error) {
          logger.error('submitProductForm failed', { error });
          throw new InternalServerError('Could not create product');
        }
      },
    ),

    updateProduct: logResolver(
      'Mutation.updateProduct',
      async (_: any, { id, ...updates }: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        const existingProduct = await prisma.product.findUnique({
          where: { id },
        });

        if (!existingProduct) throw new NotFoundError('Product');
        if (existingProduct.userId !== parseInt(userId)) {
          throw new AuthenticationError('Not authorized to edit this product');
        }

        try {
          ProductSchema.partial().parse(updates);
        } catch (err) {
          throw err;
        }

        return prisma.product.update({
          where: { id },
          data: {
            ...updates,
          },
          include: {
            user: true,
          },
        });
      },
    ),

    deleteProduct: logResolver(
      'Mutation.deleteProduct',
      async (_: any, { id }: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        const existingProduct = await prisma.product.findUnique({
          where: { id },
        });

        if (!existingProduct) throw new NotFoundError('Product');
        if (existingProduct.userId !== parseInt(userId)) {
          throw new AuthenticationError('Not authorized to delete this product');
        }

        // Soft delete
        await prisma.product.update({
          where: { id },
          data: { isDeleted: true, isAvailable: false },
        });

        return true;
      },
    ),

    buyProduct: logResolver(
      'Mutation.buyProduct',
      async (_: any, { productId }: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        const product = await prisma.product.findUnique({
          where: { id: productId, isDeleted: false, isAvailable: true },
        });

        if (!product) throw new NotFoundError('Product');
        if (product.userId === parseInt(userId)) {
          throw new ValidationError('Cannot buy your own product');
        }

        const sale = await prisma.$transaction([
          prisma.sale.create({
            data: {
              productId,
              buyerId: parseInt(userId),
              sellerId: product.userId,
            },
          }),
          prisma.product.update({
            where: { id: productId },
            data: { isAvailable: false },
          }),
        ]);

        console.log('sale', sale);

        return sale[0];
      },
    ),

    rentProduct: logResolver(
      'Mutation.rentProduct',
      async (_: any, { productId, fromDate, toDate }: any, { prisma, userId }: Context) => {
        if (!userId) throw new AuthenticationError();

        const product = await prisma.product.findUnique({
          where: { id: productId, isDeleted: false, isAvailable: true },
        });

        if (!product) throw new NotFoundError('Product');
        if (product.userId === parseInt(userId)) {
          throw new ValidationError('Cannot rent your own product');
        }

        // Check for date conflicts
        const conflictingRentals = await prisma.rental.findMany({
          where: {
            productId,
            OR: [
              {
                fromDate: { lte: new Date(toDate) },
                toDate: { gte: new Date(fromDate) },
              },
            ],
          },
        });

        if (conflictingRentals.length > 0) {
          throw new ValidationError('Product is not available for the selected dates');
        }
        const rental = await prisma.rental.create({
          data: {
            product: { connect: { id: productId } },
            lender: { connect: { id: product.userId } },
            borrower: { connect: { id: parseInt(userId) } },
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
          },
          include: {
            product: true,
            lender: true,
            borrower: true,
          },
        });

        return rental;
      },
    ),
  },
};
