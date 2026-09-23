import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

type Source = 'body' | 'query' | 'params';

/**
 * Validates `req[source]` against a zod schema. Parsed (coerced, trimmed)
 * data is stored on `res.locals[source]` so handlers receive clean input.
 */
export function validate<T extends z.ZodType>(schema: T, source: Source = 'body'): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const fields = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
      return next(ApiError.badRequest('Please check the highlighted fields.', fields));
    }
    res.locals[source] = result.data;
    next();
  };
}
