# Apple Store

A simplified Apple-like product website with purchase flow and an admin dashboard for users and billing. Built with **Angular 19**, TypeScript (strict mode), and local storage for data persistence.

## Features

- **Main screen**: Apple-style header, full-screen product carousel (3s auto-scroll), product cards with Buy Now, purchase popup (name + email, validation), sponsor section, footer with scroll-to-section links
- **Dashboard – Users**: Paginated user table (Name | Email | Items Purchased), edit-user popup (name and items editable; email read-only), left sidebar (Dashboard | Users | Billing)
- **Dashboard – Billing**: Trending products (bar chart + cards, from invoice data), paginated invoices table (Invoice ID | Product | User Email | Date | Status), sorted by date descending
- **Data**: Users and purchases/invoices stored in **local storage**; seed data used when storage is empty
- **State**: Central **StoreService** (Angular service) for user and purchase state; purchase flow updates store and local storage

## Tech stack

- Angular 19 (standalone components, signals, control flow)
- TypeScript (strict typing)
- **Tailwind CSS** – utility-first CSS framework; all SCSS files use `theme()` function and `@apply` directives
- **date-fns** – date formatting (e.g. Billing dates)
- **ng2-charts** + **Chart.js** – trending products bar chart
- Plain JavaScript utility: `src/app/utils/formatCurrency.js` (JS fundamentals; app uses TypeScript equivalent in `formatCurrency.ts` for strict typing)

## Project structure

```
src/app/
├── components/          # Reusable UI components
│   ├── product-card/    # Product card (image, details, Buy Now)
│   ├── product-carousel/
│   ├── buy-popup/
│   ├── sponsor-section/
│   ├── user-table/      # Reusable user table + pagination
│   └── invoice-list/    # Reusable invoice table + pagination
├── dashboard/           # Dashboard layout and sections
│   ├── dashboard-layout/  # Left sidebar + outlet
│   ├── dashboard-home/
│   ├── manage-users/
│   └── billing/
├── layout/
│   ├── header/
│   └── footer/
├── pages/
│   └── home/
├── services/
│   └── store.service.ts   # State + local storage (users, invoices)
├── models/               # TypeScript interfaces
│   └── store-result.model.ts  # StoreResult types for error handling
├── data/                 # Seed data (users, products, invoices)
├── utils/                # Utilities
│   ├── formatCurrency.js # Plain JavaScript utility
│   ├── formatCurrency.ts # TypeScript wrapper for app
│   └── validation.ts     # Plain JavaScript validation functions
└── app.routes.ts
```

**Tailwind CSS configuration:**
- `tailwind.config.js` – theme colors, spacing, shadows (primary, surface, text-primary, etc.)
- All SCSS files use Tailwind's `theme()` function (e.g. `color: theme('colors.primary')`) and `@apply` directives
- Global styles: `src/styles.scss` includes `@tailwind base/components/utilities`
- Angular's build system processes Tailwind automatically

**Reusable SCSS mixins:**
- `src/styles/_mixins.scss` – centralized mixins for common patterns:
  - **Popup/Modal**: `@include popup-backdrop`, `@include popup`, `@include popup-title`
  - **Forms**: `@include form-group`, `@include input`, `@include form-actions`
  - **Buttons**: `@include btn-primary`, `@include btn-secondary`, `@include btn-base`
  - **Tables**: `@include table-wrap`, `@include data-table`
  - **Pagination**: `@include pagination`, `@include btn-pagination`, `@include pagination-info`
  - **Status badges**: `@include status-badge`, `@include status-paid/pending/shipped/refunded`
  - **Layout**: `@include page-title`, `@include section-title`, `@include card`
- All component SCSS files import mixins: `@use '../../../styles/mixins' as *;`
- Reduces code duplication and ensures consistent styling across components

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
# Install dependencies (use --legacy-peer-deps if you hit peer dependency conflicts)
npm install

# Start dev server (default)
npm start

# Start with a specific environment config
npm run start:dev   # dev config (environment.dev.ts)
npm run start:qa    # QA config (environment.qa.ts)
npm run start:feature  # feature/staging config (environment.feature.ts)
```

Open [http://localhost:4200](http://localhost:4200). When not in production, the footer shows the current environment name (dev, qa, feature).

### Environment configs (dev, qa, feature)

| Config   | Serve command        | Build command       | Environment file              |
|----------|----------------------|---------------------|-------------------------------|
| **dev**  | `npm run start:dev`   | `npm run build:dev` | `src/environments/environment.dev.ts`   |
| **qa**   | `npm run start:qa`   | `npm run build:qa`  | `src/environments/environment.qa.ts`   |
| **feature** | `npm run start:feature` | `npm run build:feature` | `src/environments/environment.feature.ts` |
| **production** | `ng serve --configuration production` | `npm run build:prod` | `environment.prod.ts` |

Each environment file exports `production`, `name`, and `apiUrl`; adjust `apiUrl` per env when you add a backend.

### Build

```bash
npm run build
```

Output is in `dist/`. For production build with SSR you may need to resolve peer dependency warnings (e.g. `npm install --legacy-peer-deps`).

## Routing

| Path | Description |
|------|-------------|
| `/` | Home (carousel, products, sponsors) |
| `/dashboard` | Dashboard home |
| `/dashboard/users` | Manage users (table + edit) |
| `/dashboard/billing` | Billing (trending + invoices) |

## Reusable components

1. **ProductCard** – product image, details, price (uses `formatCurrency`), Buy Now
2. **UserTable** – user table + Previous/Next pagination; emits edit and page events
3. **InvoiceList** – invoice table + pagination; accepts `formatDate` and page events

## State management

- **StoreService** (`services/store.service.ts`): single source of truth for users and invoices. Reads/writes **local storage** keys `apple-store-users` and `apple-store-invoices`. Seed data is loaded when keys are missing. Methods: `users`, `invoices` (readonly signals), `updateUser`, `addInvoice`, `recordPurchase` (purchase flow updates invoices and user "items purchased").

**Error handling and validation:**
- **Validation utilities** (`utils/validation.ts`): Plain JavaScript validation functions for User, Invoice, Product, and arrays. Validates email format, required fields, data types, and business rules (e.g., duplicate emails, valid statuses).
- **StoreResult types** (`models/store-result.model.ts`): Type-safe result types (`StoreResult<T>`) for all store operations. Methods return `StoreResult` with `success: true/false` and either `data` or `error` with optional `code`.
- **Error signals**: `StoreService.error` signal exposes current error state. Components can subscribe and display user-friendly error messages.
- **Comprehensive validation**: All store methods validate input data before processing. Invalid data returns error results without modifying state.
- **Transaction safety**: `recordPurchase` uses rollback logic - if user creation fails after invoice creation, the invoice is rolled back.
- **Error display**: Components show error banners/messages for failed operations (e.g., purchase failures, user update errors).

## Version control (Git)

Suggested workflow:

- **Branches**: Use feature branches, e.g. `feature/users`, `feature/billing`, `feature/main-screen`.
- **Commits**: Use clear, conventional messages:
  - `feat: add user table and edit popup`
  - `feat: billing page with trending and invoices`
  - `fix: pagination when list is empty`
  - `chore: add date-fns and ng2-charts`
- **PRs**: Open a PR from the feature branch, get approval, then merge (e.g. squash or merge commit) into `main`.

Example:

```bash
git checkout -b feature/users
# ... implement ...
git add .
git commit -m "feat: manage users page with table and edit popup"
git push origin feature/users
# Open PR, merge after review
```

## Optional: full-stack upgrade

You can replace local storage with a backend (e.g. Node.js/Express, NestJS) by:

- Adding API endpoints for users and invoices (CRUD).
- Replacing `StoreService`'s local storage calls with `HttpClient` requests to that API.
- Keeping the same interfaces and component contracts so the Angular app stays largely unchanged.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 19.2.19.
