export class BaseError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHENTICATED', 401);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = 'Not authorized') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed', details?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 422, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Resource already exists') {
    super(message, 'CONFLICT', 409);
  }
}

export class RateLimitError extends BaseError {
  constructor(message = 'Too many requests') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}
