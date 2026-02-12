# People Practice Web

A simple React frontend for the RBAC (Role-Based Access Control) backend. The app provides login and registration, and displays pages for Customers, Orders, Managers, and Locations, respecting the backend's role- and scope-based access control.

## Getting Started

```bash
npm install
npm start
# or
npm run dev
```

The app runs on `http://localhost:5173` (Vite default). It expects the backend at `http://localhost:3000` by default. Configure via:

- `VITE_API_BASE_URL` – backend base URL (default: `http://localhost:3000`)
- `VITE_LOCATIONS_API_ENABLED` – set to `"true"` if `/api/locations` exists on the backend

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP client**: Fetch

## RBAC Behavior

- **Customer** (`role: customer`): Sees Orders and optionally Customers (own record only). Managers nav hidden.
- **Super admin** (`role: admin`, `type: super`): Sees Customers, Orders, Managers, Locations with system-wide data.
- **Scoped admin** (`role: admin`, `type: location` or `product`): Sees the same nav, but data is filtered by backend scopes. UI shows a "(filtered)" indicator.

The frontend hides inaccessible sections and trusts the backend for data filtering. On `403`, a friendly permission message is shown.

## Assumptions

1. **Locations**: Uses real API at `/api/locations`. Only admins with type `super` or `location` can access. Super admins can create locations (name, code, country).
2. **Manager creation**: Optional create form on the Managers page (admins only).
3. **Pagination**: Not implemented; assumes small datasets.

## Project Structure

```
src/
  api/          – HTTP client and typed modules (auth, customers, orders, managers, locations)
  auth/         – AuthContext, AuthProvider, useAuth, PrivateRoute, RBAC helpers
  components/   – Layout, DataTable
  pages/        – Login, Register, Customers, Orders, Managers, Locations
```

## Tests

```bash
npm test
```

Covers auth context (login/logout) and route protection (redirect to login when unauthenticated).
