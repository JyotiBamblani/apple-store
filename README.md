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
├── data/                 # Seed data (users, products, invoices)
├── utils/                # Utilities
│   ├── formatCurrency.js # Plain JavaScript utility
│   └── formatCurrency.ts # TypeScript wrapper for app
└── app.routes.ts
```

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
# Install dependencies (use --legacy-peer-deps if you hit peer dependency conflicts)
npm install

# Start dev server
npm start
```

Open [http://localhost:4200](http://localhost:4200).

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

- **StoreService** (`services/store.service.ts`): single source of truth for users and invoices. Reads/writes **local storage** keys `apple-store-users` and `apple-store-invoices`. Seed data is loaded when keys are missing. Methods: `users`, `invoices` (readonly signals), `updateUser`, `addInvoice`, `recordPurchase` (purchase flow updates invoices and user “items purchased”).

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
- Replacing `StoreService`’s local storage calls with `HttpClient` requests to that API.
- Keeping the same interfaces and component contracts so the Angular app stays largely unchanged.

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 19.2.19.
