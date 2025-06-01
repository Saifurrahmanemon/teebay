import type { Context } from "../../lib/context.js";

export const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: Context) => {
      return prisma.user.findMany({});
    },
  },
};
