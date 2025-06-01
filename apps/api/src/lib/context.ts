import { prisma } from './prisma'

export interface Context {
  prisma: typeof prisma
}

export const createContext = (): Context => {
  return {
    prisma,
  }
}