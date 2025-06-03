import logger from './loggers';

export function logResolver<TArgs = any, TContext = any, TResult = any>(
  resolverName: string,
  resolverFn: (_: any, args: TArgs, context: TContext) => Promise<TResult>,
) {
  return async (_: any, args: TArgs, context: TContext) => {
    const userId = (context as any).userId;
    logger.info(`[START] ${resolverName}`, { args, userId });

    try {
      const result = await resolverFn(_, args, context);
      logger.info(`[END] ${resolverName}`, { userId });
      return result;
    } catch (error: any) {
      logger.error(`[ERROR] ${resolverName}`, {
        message: error.message,
        stack: error.stack,
        userId,
      });
      throw error;
    }
  };
}
