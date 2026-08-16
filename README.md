<p align="center">
  <h1 align="center">APAN Apparel — Backend API</h1>
  <p align="center"><em>Scalable e-commerce API built with NestJS, Prisma, and PostgreSQL</em></p>
</p>

A production-ready REST API powering a full e-commerce platform for a premium apparel brand. Built with **NestJS**, **Prisma**, and **PostgreSQL**, it covers the entire commerce and inventory lifecycle — from catalog management and checkout to procurement and stock tracking. Deployed as a serverless function on Vercel.

## Highlights

- **Complete commerce domain**: products with variants, images, categories, brands, and collections; guest and user carts; order management with status workflows.
- **Inventory & procurement**: suppliers, purchase orders, and stock movements with full traceability back to orders and purchase orders.
- **Authentication & authorization**: JWT-based auth with Passport, role-based access (USER / ADMIN), and secure password hashing.
- **File uploads**: image storage via Vercel Blob.
- **API documentation**: auto-generated Swagger/OpenAPI docs.
- **Production-tested patterns**: global validation, centralized exception filter, uniform response envelope, and cache-control interceptor.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | NestJS 11 (TypeScript) |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | Passport + JWT |
| Validation | class-validator + class-transformer |
| Docs | Swagger / OpenAPI |
| Storage | Vercel Blob |
| Deployment | Vercel (serverless) |

## Getting Started

**Prerequisites:** Node.js 18+, and a PostgreSQL database.

1. Install dependencies:
   ```bash
   $ npm install
   ```

2. Configure environment variables in `.env`:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/apan_backend?schema=public"
   PORT=8000
   JWT_SECRET="some-long-random-string"
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
   ```

3. Run migrations and generate the Prisma client:
   ```bash
   $ npx prisma migrate dev
   $ npx prisma generate
   ```

## Running the API

```bash
# development (watch mode)
$ npm run start:dev

# production
$ npm run start:prod
```

The API listens on `http://localhost:8000` (configurable via `PORT`). Swagger docs are available at `/api/docs`.

## Tests

```bash
$ npm run test       # unit tests
$ npm run test:e2e   # e2e tests
$ npm run test:cov   # test coverage
```

## Architecture

```
src/
  auth/             JWT auth, guards, strategies, DTOs
  products/         products, variants, images
  brands/           brand management
  categories/       category management
  collections/      collection management
  cart/             guest + user carts
  orders/           orders and order items
  suppliers/        supplier management
  purchase-orders/  procurement
  stock-movements/  inventory tracking
  uploads/          Vercel Blob image uploads
  site/             site settings
  common/           shared filters, interceptors, utilities
  prisma/           Prisma service
prisma/             schema and migrations
api/index.ts        Vercel serverless entrypoint
```

Requests flow through a consistent pipeline: global validation → exception filter → response interceptor, returning a uniform `{ success, statusCode, data }` envelope.

## Related

- **Storefront**: [AK-Tanha/Tshirt](https://github.com/AK-Tanha/Tshirt) — Next.js e-commerce frontend
- **Live API**: https://apan-backend.vercel.app
- **Live storefront**: https://apontraders.vercel.app