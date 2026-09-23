import type { RequestHandler } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Guards admin routes with a shared secret sent in the `x-api-key` header. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  const configured = env.ADMIN_API_KEY;
  if (!configured || (env.isProduction && configured.length < 24)) {
    return next(new ApiError(503, 'Admin API is not configured'));
  }
  const provided = req.get('x-api-key');
  if (!provided || !safeEqual(provided, configured)) return next(ApiError.unauthorized());
  next();
};
