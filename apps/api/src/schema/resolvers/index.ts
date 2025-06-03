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
  validateCompleteProduct,
  validateProductFormSession,
  validateProductResponse,
  validateProductStep,
} from '@teebay/validations';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { prisma, userId }: Context) => {
      try {
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
      } catch (error) {
        if (error instanceof BaseError) throw error;
        throw new InternalServerError('Failed to fetch user profile');
      }
    },
    users: async (_: any, __: any, { prisma }: Context) => {
      return prisma.user.findMany({});
    },
    getProductsByUser: async (_: any, { userId }: any, { prisma }: Context) => {
      const products = await prisma.product.findMany({
        where: { userId: parseInt(userId), isDeleted: false },
        include: { user: true },
      });
      return products.map((product: any) => validateProductResponse(product));
    },

    getProductFormState: async (_: any, { id }: any, { prisma, userId }: Context) => {
      if (!userId) throw new AuthenticationError();

      if (id) {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundError('Product');
        return {
          step: 1,
          totalSteps: 5,
          formData: product,
        };
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
  },

  Mutation: {
    register: async (_parent: any, args: any, { prisma }: Context) => {
      const { email, password, firstName, lastName, phone, address } = args;

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

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

    login: async (_: any, { email, password }: any, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = generateToken(user.id?.toString());
      return { token, user };
    },

    createProductStep: async (_: any, { step, formData }: any, { prisma, userId }: Context) => {
      if (!userId) throw new AuthenticationError();
      if (step < 1 || step > 5) throw new ValidationError('Invalid step number');

      try {
        validateProductStep(step, formData);
      } catch (err: any) {
        throw err;
      }

      const sessionId = `product-form-${userId}`;

      // Fetch or create session
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

    submitProductForm: async (_: any, __: any, { prisma, userId }: Context) => {
      if (!userId) throw new AuthenticationError();
      const session = await prisma.productFormSession.findUnique({
        where: { userId: parseInt(userId) },
      });
      if (!session) throw new ValidationError('No product form in progress');

      // Validate & create product
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
        console.error('Failed to create product:', error);
        throw new InternalServerError('Could not create product');
      }
    },
  },
};
