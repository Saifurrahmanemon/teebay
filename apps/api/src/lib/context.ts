/* eslint-disable @typescript-eslint/no-explicit-any */

import { verifyToken } from '../utils/auth';
import logger from '../utils/loggers';

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
    } catch (err) {
      logger.warn('Invalid token', err);
    }
  }

  return { prisma, userId };
};
