# DeBu — Handcrafted Elegance for Every Celebration

A premium, festive e-commerce and service-booking website for **DeBu**, a home business crafting
**silk thread jewellery**, **custom wire bags**, **blouse alterations** and **bridal mehandi**.

| Layer | Stack |
| --- | --- |
| Storefront | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP + ScrollTrigger · Lenis smooth scroll · Zustand · React Hook Form + Zod |
| API | Node.js · Express 5 · TypeScript · Zod validation · Helmet · rate limiting |
| Database | MongoDB (Mongoose 9) |
| Shared | `@debu/shared` — catalogue, store config and the pricing engine used by **both** client and server |

---

## Features

**Design & motion**: maroon, gold, rani pink, marigold and haldi-yellow palette; Cormorant Garamond, Great Vibes, Cinzel and Jost type;
hanging marigold torans, rotating mandalas, falling petals, twinkling sparkles, GSAP hero timeline and scroll-scrubbed parallax,
ScrollTrigger batch reveals, Framer Motion page transitions, hover reveals, animated counters, marquee, masonry gallery with lightbox.
Fully responsive, respects `prefers-reduced-motion`.

**Illustrated product imagery**: every product ships with hand-built SVG artwork (bangles, necklaces on a display bust, jhumkas,
chandbalis, maang tikkas, woven wire bags, blouses, mehandi hands). Artwork **recolours live** as the customer picks a colour, and each
product has four views (studio, close-up, velvet, festive). Add real photos to a product's `images` array and they take over automatically.

**Silk Thread Jewellery**: Bangles, Necklaces, Earrings and Forehead Pendants category pages. Every card has an image, name, ₹ price,
description, colour picker (Red, Green, Blue, Pink, Maroon, Yellow, Gold, or a **Custom Color Request** with free text), quantity and Add to Cart.
The product page has a multi-view gallery, hover/tap zoom, Buy Now, related products and JSON-LD.
**Combos**: Bridal, Festival and Haldi, showing the original price, combo price and savings.

**Wire Bags**: gallery of fully customisable bags, each with Small / Medium / Large sizes, colour options and customisation notes.
**Complete Collection Combo**: *Get ₹75 OFF when purchasing all three sizes*. It is applied automatically per full S+M+L set, in the cart and on the server.

**Shopping**: persistent cart (drawer + page), wishlist, instant search (⌘/Ctrl + K) and a `/search` page, and filtering by category, price and colour.
Coupons (`DEBU10`, `FESTIVE150`, `WELCOME50`), GST line (configurable), free shipping over ₹1,499, INR everywhere.

**Checkout**: name, mobile, email, address, city, state, pincode; Cash on Delivery, UPI (placeholder) and Online Payment (placeholder); order confirmation with summary.
**Resilient by design:** if the API is unreachable, orders, bookings and messages fall back to a pre-filled WhatsApp message, so no lead is lost.

**Services**: Blouse Alteration (before/after slider, five services, process and booking form) and Mehandi (five occasions, gallery,
*Book Your Mehandi Artist Today* form). The two contact lines appear throughout with **Call Now** and **WhatsApp Now**:

| Line | Phone |
| --- | --- |
| Silk Thread Jewellery & Wire Bags | **8344688688** |
| Blouse Alteration & Mehandi | **9786488488** |

---

## Project structure

```
DeBu/
├── shared/                 @debu/shared: plain ESM + .d.ts, no build step
│   └── src/
│       ├── config.js       brand, contacts, colours, coupons, GST, shipping, combo discount, states
│       ├── catalog.js      sample products & combos (API seed + storefront fallback)
│       ├── pricing.js      computeTotals / evaluateCoupon / wire-bag collection logic
│       └── pricing.test.js
├── server/                 Express API
│   ├── src/
│   │   ├── config/         env (zod-validated), Mongo connection with retries
│   │   ├── models/         Product, Combo, Order, Booking, ContactMessage
│   │   ├── validators/     zod schemas (cart, orders, bookings, contact, products, admin)
│   │   ├── services/       catalog repository (Mongo + in-memory), pricing, notifications hook
│   │   ├── controllers/    catalogue, orders, bookings/contact, admin
│   │   ├── routes/         /api and /api/admin
│   │   ├── middleware/     validation, errors, admin API key, rate limits
│   │   └── scripts/seed.ts
│   └── test/api.test.ts    supertest suite (runs without MongoDB)
├── client/                 Next.js storefront
│   └── src/
│       ├── app/            routes (see below), sitemap, robots, icon
│       ├── components/
│       │   ├── art/        SVG artwork engine (jewellery, bags, blouse, mehandi, décor)
│       │   ├── home/ layout/ product/ cart/ services/ gallery/ contact/ effects/ ui/
│       ├── store/          cart, wishlist, UI (Zustand + localStorage)
│       ├── lib/            catalog (server), api (client), contact links, formatting
│       └── data/content.ts testimonials, services, gallery, FAQs, navigation
└── docker-compose.yml      MongoDB + API + storefront
```

### Routes

| Path | Page |
| --- | --- |
| `/` | Home: hero, featured categories, stats, bestsellers, why choose us, combos, services, gallery, testimonials, contact banner |
| `/silk-thread-jewellery` | Categories, full collection with filters, combos (`#combos`) |
| `/silk-thread-jewellery/[category]` | `bangles`, `necklaces`, `earrings`, `forehead-pendants` |
| `/product/[slug]` | Product details |
| `/wire-bags` | Wire bag gallery + Complete Collection Combo |
| `/blouse-alteration`, `/mehandi` | Service pages with booking forms |
| `/contact`, `/gallery` | Contact (form, FAQ), masonry gallery |
| `/cart`, `/checkout`, `/order-success` | Shopping flow |
| `/wishlist`, `/search?q=` | Wishlist, search results |

### API

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/health` | Status + DB connection |
| GET | `/api/products` | `category, type, color, minPrice, maxPrice, q, featured, sort, page, limit` |
| GET | `/api/products/:slug` | Product + related |
| GET | `/api/combos`, `/api/combos/:slug` | Combos |
| POST | `/api/cart/quote` | Authoritative totals: prices come from the DB, not the client |
| GET/POST | `/api/coupons`, `/api/coupons/validate` | Coupon list / validation |
| POST | `/api/orders` | Place order (re-priced server-side) |
| GET | `/api/orders/:orderNumber?phone=` | Order tracking |
| POST | `/api/bookings` | `service: "blouse-alteration" \| "mehandi"` |
| POST | `/api/contact` | Enquiries |
| * | `/api/admin/*` | Product CRUD (soft delete), orders, bookings, messages, stats. Needs the `x-api-key` header |

---

## Getting started

Requires **Node.js ≥ 20.9** (22 recommended) and **MongoDB** (local, Docker or Atlas).

```bash
npm install                                    # installs all workspaces
cp server/.env.example server/.env             # set MONGODB_URI, ADMIN_API_KEY
cp client/.env.example client/.env.local       # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run seed                                   # load sample catalogue into MongoDB
npm run dev                                    # API on :5000, storefront on :3000
```

The storefront also runs **without the API**: leave `NEXT_PUBLIC_API_URL` empty and it uses the bundled catalogue, with forms
falling back to WhatsApp. That's handy for a quick preview or a static deploy.

### Docker

```bash
docker compose up --build
docker compose exec api node server/dist/scripts/seed.js
```

### Quality checks

```bash
npm test            # shared pricing tests + API tests (supertest, no DB needed)
npm run typecheck   # server + client
npm run lint -w client
npm run build
```

---

## Customising

- **Prices, coupons, GST, shipping, phone numbers, combo discount**: `shared/src/config.js`
- **Products & combos**: `shared/src/catalog.js`, then `npm run seed` (or use the admin API)
- **Real photos**: put images in `client/public/images/...` and list them in a product's `images`
  (index 0 = main, 1 = close-up, 2/3 = styled views). Admin API example:
  ```bash
  curl -X PATCH http://localhost:5000/api/admin/products/classic-basket-wire-bag \
    -H "x-api-key: $ADMIN_API_KEY" -H "Content-Type: application/json" \
    -d '{"images":["/images/bags/classic-1.jpg","/images/bags/classic-2.jpg"]}'
  ```
- **Testimonials, services, gallery, FAQs**: `client/src/data/content.ts`
- **Payments**: UPI ID via `NEXT_PUBLIC_UPI_ID`; plug a gateway (e.g. Razorpay) into `CheckoutForm` + `order.controller`
- **Notifications**: wire WhatsApp Business / SMS / email into `server/src/services/notification.service.ts`
