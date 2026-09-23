import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDatabase(uri = env.MONGODB_URI, retries = 5): Promise<typeof mongoose> {
  for (let attempt = 1; ; attempt++) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`🍃 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      if (attempt >= retries) throw err;
      const wait = attempt * 2000;
      console.warn(`MongoDB connection failed (attempt ${attempt}/${retries}). Retrying in ${wait / 1000}s…`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
