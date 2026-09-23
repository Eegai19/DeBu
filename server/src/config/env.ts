import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/debu'),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  ADMIN_API_KEY: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  clientOrigins: parsed.data.CLIENT_ORIGIN.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

if (env.isProduction && (!env.ADMIN_API_KEY || env.ADMIN_API_KEY.length < 24)) {
  console.warn('⚠️  ADMIN_API_KEY is missing or too short — admin routes are disabled.');
}
