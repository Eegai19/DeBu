import type { RequestHandler } from 'express';
import { evaluateCoupon, COUPONS } from '@debu/shared';
import type { CatalogRepository } from '../services/catalog.repository.js';
import { quoteCart } from '../services/pricing.service.js';
import type { ProductQuery } from '../validators/product.js';
import { ApiError } from '../utils/ApiError.js';

export function catalogController(catalog: CatalogRepository) {
  const listProducts: RequestHandler = async (_req, res) => {
    const query = res.locals.query as ProductQuery;
    const page = await catalog.listProducts(query);
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ success: true, data: page.items, meta: { total: page.total, page: page.page, pages: page.pages } });
  };

  const getProduct: RequestHandler<{ slug: string }> = async (req, res) => {
    const product = await catalog.findProduct(req.params.slug);
    if (!product) throw ApiError.notFound('Product not found');

    const related = await catalog.listProducts({
      category: product.category as ProductQuery['category'],
      sort: 'featured',
      page: 1,
      limit: 5,
    });
    res.json({
      success: true,
      data: product,
      related: related.items.filter((p) => p.slug !== product.slug).slice(0, 4),
    });
  };

  const listCombos: RequestHandler = async (_req, res) => {
    res.json({ success: true, data: await catalog.listCombos() });
  };

  const getCombo: RequestHandler<{ slug: string }> = async (req, res) => {
    const combo = await catalog.findCombo(req.params.slug);
    if (!combo) throw ApiError.notFound('Combo not found');
    res.json({ success: true, data: combo });
  };

  const quote: RequestHandler = async (_req, res) => {
    const { items, couponCode } = res.locals.body;
    const result = await quoteCart(catalog, items, couponCode);
    res.json({ success: true, data: result });
  };

  const validateCoupon: RequestHandler = async (_req, res) => {
    const { code, amount } = res.locals.body as { code: string; amount: number };
    const result = evaluateCoupon(code, amount);
    res.status(result.valid ? 200 : 422).json({
      success: result.valid,
      message: result.message,
      data: { discount: result.discount, coupon: result.coupon ?? null },
    });
  };

  const listCoupons: RequestHandler = (_req, res) => {
    res.json({ success: true, data: COUPONS.map(({ code, description, minOrder }) => ({ code, description, minOrder })) });
  };

  return { listProducts, getProduct, listCombos, getCombo, quote, validateCoupon, listCoupons };
}
