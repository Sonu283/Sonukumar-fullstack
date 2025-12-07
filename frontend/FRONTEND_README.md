# E-Commerce Frontend

A modern, responsive Next.js 16 frontend for a full-stack e-commerce application with TypeScript, Tailwind CSS, and seamless API integration.

## Overview

This frontend provides a complete user interface for:
- **Authentication**: User registration and login with JWT tokens
- **Product Browsing**: Search, filter by category, and sort products
- **Shopping Cart**: Add/remove items and manage quantities
- **Checkout**: Complete purchase orders
- **Order History**: View past orders and transactions
- **Admin Dashboard**: Product management and sales reports (admin users only)

## Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Package Manager**: npm
- **Runtime**: Node.js

## Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, update with your deployed backend URL.

## Running Locally

### Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── auth/login/page.tsx     # Login page
│   ├── auth/signup/page.tsx    # Signup page
│   ├── products/page.tsx       # Product listing
│   ├── cart/page.tsx           # Shopping cart
│   ├── orders/page.tsx         # Checkout
│   ├── orders/history/page.tsx # Order history
│   ├── admin/products/page.tsx # Product management
│   └── admin/reports/page.tsx  # Sales reports
├── components/
│   └── Navbar.tsx              # Navigation
├── libs/
│   └── api.ts                  # API utility
└── public/                     # Static assets
```

## Page Routes

| Route | Purpose | Protected |
|-------|---------|-----------|
| `/` | Home page | No |
| `/auth/login` | User login | No |
| `/auth/signup` | User registration | No |
| `/products` | Browse products | No |
| `/cart` | Shopping cart | Yes |
| `/orders` | Checkout | Yes |
| `/orders/history` | Order history | Yes |
| `/admin/products` | Product management | Admin |
| `/admin/reports` | Sales reports | Admin |

## Key Features

### 1. Authentication
- Secure JWT-based login/signup
- User info displayed in Navbar
- Token stored in localStorage
- Logout functionality
- Admin role support

### 2. Product Management
- Search by name or SKU
- Filter by category
- Server-side sorting (ascending/descending)
- Pagination support
- Product details

### 3. Shopping Cart
- Add/remove items
- Update quantities
- Cart summary
- Proceed to checkout

### 4. Checkout & Orders
- Order review
- Checkout confirmation
- Order history
- Order details with items

### 5. Admin Dashboard
- Create/Edit/Delete products
- Daily revenue reports (SQL)
- Category-wise sales (MongoDB)

## API Integration

All API calls use the `apiFetch` utility:

```typescript
const products = await apiFetch("/api/products");
const order = await apiFetch("/api/checkout", "POST");
```

Features:
- Automatic JWT token injection
- Error handling
- Supports GET, POST, PUT, DELETE

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Deployment to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Set `NEXT_PUBLIC_API_URL` in environment variables
4. Deploy

## Troubleshooting

**API Connection Issues**:
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check CORS settings

**Build Errors**:
- Clear `.next`: `rm -rf .next`
- Reinstall: `npm install`

## Admin Test Account

```
Email: admin@example.com
Password: AdminPass123!
Admin Key: helloAdmin753
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

ISC
