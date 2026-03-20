export class ToutiaoError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ToutiaoError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends ToutiaoError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUTH_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class PublishError extends ToutiaoError {
  constructor(message: string, details?: unknown) {
    super(message, 'PUBLISH_ERROR', details);
    this.name = 'PublishError';
  }
}

export class NetworkError extends ToutiaoError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ToutiaoError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class TimeoutError extends ToutiaoError {
  constructor(message: string, details?: unknown) {
    super(message, 'TIMEOUT_ERROR', details);
    this.name = 'TimeoutError';
  }
}

export function isKnownError(error: unknown): error is ToutiaoError {
  return error instanceof ToutiaoError;
}

export function formatError(error: unknown): string {
  if (isKnownError(error)) {
    return `[${error.code}] ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
