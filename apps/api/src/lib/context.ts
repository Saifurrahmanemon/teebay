import { verifyToken } from '../utils/auth';
import { prisma } from './prisma';

export interface Context {
  prisma: typeof prisma;
  userId: string | null;
}

export const createContext = ({ req }: any): Context => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let userId = null;
  if (token) {
    try {
      const payload = verifyToken(token);
      userId = payload.userId;
    } catch (e) {
      console.warn('Invalid token');
    }
  }

  return { prisma, userId };
};
