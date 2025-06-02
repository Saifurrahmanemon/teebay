import type { Context } from '../../lib/context.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/auth.js';
import {
  AuthenticationError,
  BaseError,
  InternalServerError,
  NotFoundError,
} from '../../utils/errors.js';

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
  },
};
