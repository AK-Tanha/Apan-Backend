<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

# APAN Apparel — Backend (Apan-Backend)

REST API backend for the APAN Apparel / Court Classic storefront. Built with [NestJS](https://nestjs.com), [Prisma](https://www.prisma.io), and PostgreSQL.

## Description

Backend API powering the [storefront](https://github.com/AK-Tanha/Tshirt). Handles authentication, catalog management (products, categories, brands, collections), cart and orders, inventory tracking (stock movements, suppliers, purchase orders), image uploads (Vercel Blob), and site settings.

Swagger docs are available at `/api/docs` in non-production environments.

## Tech Stack

- [NestJS](https://nestjs.com) 11
- [Prisma](https://www.prisma.io) + PostgreSQL
- [Passport](https://www.passportjs.org/) + JWT authentication
- [Swagger](https://docs.nestjs.com/openapi/introduction) OpenAPI docs
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for image storage
- Deployable as a serverless function on Vercel

## Project setup

**Prerequisites:** Node.js and a PostgreSQL database.

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

3. Run Prisma migrations and generate the client:
   ```bash
   $ npx prisma migrate dev
   $ npx prisma generate
   ```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API listens on `http://localhost:8000` by default (configurable via `PORT`). Swagger docs are served at `/api/docs`.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

The backend is configured to run as a serverless function on Vercel via `api/index.ts`. The `vercel-build` script deploys Prisma migrations, generates the Prisma client, and builds the app:

```bash
$ npm run vercel-build
```

Ensure the following environment variables are set in Vercel:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret used to sign/verify JWTs
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob read/write token for image uploads

## Project Structure

- `src/auth/` — authentication, guards, strategies, and DTOs
- `src/products/`, `src/brands/`, `src/categories/`, `src/collections/` — catalog modules
- `src/cart/`, `src/orders/` — commerce modules
- `src/suppliers/`, `src/purchase-orders/`, `src/stock-movements/` — inventory modules
- `src/uploads/` — Vercel Blob image uploads
- `src/site/` — site settings
- `src/common/` — shared filters, interceptors, and utilities
- `src/prisma/` — Prisma service
- `prisma/` — schema and migrations
- `api/index.ts` — Vercel serverless entrypoint

## Deployed

- API: https://apan-backend.vercel.app
- Storefront: https://apontraders.vercel.app

## Repositories

- Backend: https://github.com/AK-Tanha/Apan-Backend
- Storefront: https://github.com/AK-Tanha/Tshirt