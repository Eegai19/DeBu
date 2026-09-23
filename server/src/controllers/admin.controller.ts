import type { RequestHandler } from 'express';
import type { Model } from 'mongoose';
import { BookingModel, ContactMessageModel, OrderModel, ProductModel } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

type ListQuery = { status?: string; page: number; limit: number };

function paginate(model: Model<any>): RequestHandler {
  return async (_req, res) => {
    const { status, page, limit } = res.locals.query as ListQuery;
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      model.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, meta: { total, page, pages: Math.max(1, Math.ceil(total / limit)) } });
  };
}

function updateStatus(model: Model<any>, label: string): RequestHandler<{ id: string }> {
  return async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, res.locals.body, { new: true, runValidators: true });
    if (!doc) throw ApiError.notFound(`${label} not found`);
    res.json({ success: true, data: doc });
  };
}

// ── Products ──
export const adminListProducts: RequestHandler = async (_req, res) => {
  const products = await ProductModel.find().sort({ category: 1, name: 1 });
  res.json({ success: true, data: products.map((p) => ({ ...p.toJSON(), isActive: p.isActive, _id: p._id })) });
};

export const adminCreateProduct: RequestHandler = async (_req, res) => {
  const product = await ProductModel.create(res.locals.body);
  res.status(201).json({ success: true, data: product });
};

export const adminUpdateProduct: RequestHandler<{ slug: string }> = async (req, res) => {
  // Only apply keys the client actually sent (schema defaults must not overwrite data).
  const sent = Object.keys(req.body ?? {});
  const update = Object.fromEntries(Object.entries(res.locals.body).filter(([k]) => sent.includes(k)));
  const product = await ProductModel.findOneAndUpdate({ slug: req.params.slug }, update, {
    new: true,
    runValidators: true,
  });
  if (!product) throw ApiError.notFound('Product not found');
  res.json({ success: true, data: product });
};

/** Soft delete — keeps historical orders consistent. */
export const adminDeleteProduct: RequestHandler<{ slug: string }> = async (req, res) => {
  const product = await ProductModel.findOneAndUpdate({ slug: req.params.slug }, { isActive: false }, { new: true });
  if (!product) throw ApiError.notFound('Product not found');
  res.json({ success: true, message: `${product.name} archived` });
};

// ── Orders, bookings, messages ──
export const adminListOrders = paginate(OrderModel);
export const adminUpdateOrder = updateStatus(OrderModel, 'Order');
export const adminListBookings = paginate(BookingModel);
export const adminUpdateBooking = updateStatus(BookingModel, 'Booking');
export const adminListMessages = paginate(ContactMessageModel);
export const adminUpdateMessage = updateStatus(ContactMessageModel, 'Message');

export const adminStats: RequestHandler = async (_req, res) => {
  const [orders, revenue, pendingOrders, bookings, newBookings, messages] = await Promise.all([
    OrderModel.countDocuments(),
    OrderModel.aggregate<{ total: number }>([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    OrderModel.countDocuments({ status: 'placed' }),
    BookingModel.countDocuments(),
    BookingModel.countDocuments({ status: 'new' }),
    ContactMessageModel.countDocuments({ status: 'new' }),
  ]);
  res.json({
    success: true,
    data: { orders, revenue: revenue[0]?.total ?? 0, pendingOrders, bookings, newBookings, newMessages: messages },
  });
};
