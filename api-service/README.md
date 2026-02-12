# E-Commerce RBAC System

Role-Based Access Control (RBAC) system for an e-commerce platform with scoped permissions by location and product line. Users (authentication) are separate from Customers and Managers (business domain).

## Tech Stack

- Node.js v18+, Express.js, PostgreSQL
- JWT (jsonwebtoken), bcrypt, Joi, dotenv, pg

## Setup

1. Copy `.env.example` to `.env` and set your database and JWT secret.
2. Create a PostgreSQL database and run migrations:
   ```bash
   npm run migrate
   npm run seed
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Customers**: `GET/POST /api/customers`, `GET/PATCH /api/customers/:id` (auth required, scoped by role)
- **Orders**: `GET/POST /api/orders`, `GET /api/orders/:id` (auth required, scoped by role)
- **Managers**: `GET/POST /api/managers`, `GET /api/managers/:id` (admin only)

## Roles

- **admin** — Full access.
- **location_manager** — Access scoped to assigned locations.
- **product_manager** — Access scoped to orders containing assigned products.
- **customer** — Can create and view own orders only.

## Tests

- Unit tests (policies): `npm test -- tests/unit`
- Integration tests require a running PostgreSQL database with migrations and seed: `npm test`

Default seed creates admin user: `admin@ecommerce.com` / `admin123`.
