import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { mongoCatalog, type CatalogRepository } from './services/catalog.repository.js';

export interface AppDeps {
  catalog?: CatalogRepository;
}

export function createApp({ catalog = mongoCatalog }: AppDeps = {}): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin / server-to-server requests (no Origin header).
        if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'x-api-key'],
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  if (env.NODE_ENV !== 'test') app.use(morgan(env.isProduction ? 'combined' : 'dev'));

  app.get('/', (_req, res) => {
    res.json({ name: 'DeBu API', tagline: 'Handcrafted Elegance for Every Celebration', docs: '/api/health' });
  });
  app.use('/api', apiLimiter, apiRouter(catalog));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
