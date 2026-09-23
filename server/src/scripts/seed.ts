/**
 * Seeds MongoDB with the sample DeBu catalogue from @debu/shared.
 *   npm run seed            → upsert products & combos (safe to re-run)
 *   npm run seed -- --fresh → wipe products & combos first
 */
import { products, combos } from '@debu/shared';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { ComboModel, ProductModel } from '../models/index.js';

async function seed() {
  const fresh = process.argv.includes('--fresh');
  await connectDatabase();

  if (fresh) {
    await Promise.all([ProductModel.deleteMany({}), ComboModel.deleteMany({})]);
    console.log('🧹 Cleared products and combos');
  }

  const upsert = { upsert: true, runValidators: true, setDefaultsOnInsert: true };
  for (const p of products) {
    await ProductModel.findOneAndUpdate({ slug: p.slug }, { ...p, isActive: true }, upsert);
  }
  for (const c of combos) {
    await ComboModel.findOneAndUpdate({ slug: c.slug }, { ...c, isActive: true }, upsert);
  }
  await Promise.all([ProductModel.syncIndexes(), ComboModel.syncIndexes()]);

  console.log(`🌸 Seeded ${products.length} products and ${combos.length} combos`);
  await disconnectDatabase();
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err);
  await disconnectDatabase();
  process.exit(1);
});
