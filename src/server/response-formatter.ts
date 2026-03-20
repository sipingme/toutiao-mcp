import { formatError, isKnownError } from '../utils/errors.js';

export function formatSuccessResponse(data: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function formatErrorResponse(error: unknown) {
  const errorMessage = formatError(error);
  
  const response: Record<string, unknown> = {
    success: false,
    message: errorMessage,
  };

  if (isKnownError(error)) {
    response.code = error.code;
    if (error.details) {
      response.details = error.details;
    }
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
    isError: true,
  };
}
