# E-Commerce Full-Stack Application

A complete, production-ready e-commerce web application built with modern technologies, demonstrating full-stack development with secure authentication, product management, shopping cart, and order processing.

## Project Overview

This application implements a fully functional e-commerce platform with:
- User authentication and authorization (JWT-based)
- Product catalog management (MongoDB)
- Shopping cart operations
- Order checkout with server-side calculations
- Admin dashboard with reports (SQL & MongoDB aggregations)
- Responsive frontend with Next.js
- Secure backend with Express.js

## Technology Stack

### Backend
- **Framework**: Express.js 5.2.1
- **SQL Database**: PostgreSQL (via Prisma ORM)
- **NoSQL Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **Testing**: Jest 29.7.0
- **ORM**: Prisma 6.19.0

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Fetch API with custom utility

## Project Structure

```
ecommerce-app/
├── backend/
│   ├── controllers/          # Business logic
│   ├── middleware/           # Authentication & authorization
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   ├── prisma/              # Database schema & migrations
│   ├── tests/               # Jest test files
│   ├── server.js            # Entry point
│   ├── package.json         # Dependencies
│   ├── jest.config.js       # Test configuration
│   ├── .env                 # Environment variables
│   └── README.md            # Backend documentation
│
└── frontend/
    ├── app/
    │   ├── auth/            # Login & signup pages
    │   ├── products/        # Product listing
    │   ├── cart/            # Shopping cart
    │   ├── orders/          # Checkout & history
    │   ├── admin/           # Admin dashboard
    │   └── layout.tsx       # Root layout
    ├── components/          # Reusable components
    ├── libs/               # API utility functions
    ├── public/             # Static assets
    ├── package.json        # Dependencies
    ├── .env.local          # Environment variables
    ├── tsconfig.json       # TypeScript config
    ├── next.config.ts      # Next.js config
    └── FRONTEND_README.md  # Frontend documentation
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- MongoDB database
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Configure environment variables in .env:
# - DATABASE_URL (PostgreSQL)
# - MONGO_URI (MongoDB)
# - JWT_SECRET (random string)
# - ADMIN_KEY (secret for admin registration)

# Run migrations
npx prisma migrate dev --name init

# Start backend
npm start
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local

# Configure environment variables in .env.local:
# - NEXT_PUBLIC_API_URL=http://localhost:3000

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Core Features

### 1. Authentication
- **Registration**: Create account with name, email, password
- **Admin Registration**: Use admin key during signup
- **Login**: Secure JWT-based login
- **Logout**: Clear session and tokens
- **Protected Routes**: Routes require valid JWT token

### 2. Product Management (Admin)
- Create new products (SKU, name, price, category)
- Update product details
- Delete products
- View all products with pagination

### 3. Product Browsing (All Users)
- **Server-Side Sorting**: Products sorted by price (descending default, ascending with `x-sort: asc` header)
- **Filtering**: Filter by category
- **Search**: Search by product name or SKU
- **Pagination**: Navigate through product pages
- **Sorting Logic**: Implemented on server - not client-side

### 4. Shopping Cart
- Add items to cart with quantity
- Update item quantities
- Remove items
- View cart summary
- Calculate total (updated at checkout)

### 5. Order Checkout
- Review cart items before checkout
- Server-side total calculation
- Create order with order items
- Clear cart after successful checkout
- Order confirmation page

### 6. Orders & History
- View order history (user orders)
- See order details with items and prices
- Track order creation date

### 7. Admin Dashboard
- **Reports Page**:
  - Daily revenue aggregation (PostgreSQL)
  - Category-wise product count (MongoDB)
  - Visual data display

## API Endpoints

All endpoints documented in `/backend/README.md`

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Product Routes
- `GET /api/products` - List all products (with search, filter, pagination, sorting)
- `POST /api/products/create` - Create product (admin)
- `PUT /api/products/update/:id` - Update product (admin)
- `DELETE /api/products/delete/:id` - Delete product (admin)
- `POST /api/products/details` - Get product details by IDs

### Cart Routes
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get user cart
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout Routes
- `POST /api/checkout` - Create order from cart

### Order Routes
- `GET /api/orders` - Get user orders

### Reports Routes
- `GET /api/reports` - Get sales reports (admin)

## Database Schemas

### PostgreSQL (Prisma)
```
Users: id, name, email, passwordHash, role, createdAt
Orders: id, userId, total, createdAt
OrderItems: id, orderId, productId, quantity, priceAtPurchase
CartItems: id, userId, productId, quantity
```

### MongoDB
```
Products: _id, sku, name, price, category, updatedAt, createdAt
Indexes: sku (unique), category, updatedAt
```

## Testing

Run all tests with coverage:

```bash
cd backend
npm run test
```

### Test Files

1. **auth.test.js** - JWT token generation, password hashing, token verification
2. **sorting.test.js** - Server-side product sorting (default & ascending)
3. **checkout.test.js** - Order creation, total calculation, cart operations

See `/backend/README.md` for detailed test documentation.

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication with expiration
- ✅ Role-based access control (admin/customer)
- ✅ Input validation on all endpoints
- ✅ Database indexes for performance
- ✅ CORS configured
- ✅ Environment variables for secrets
- ✅ Protected sensitive routes

## Deployment

### Backend Deployment
Deploy to Render, Railway, AWS, or Azure:
1. Set up PostgreSQL database
2. Set up MongoDB database
3. Configure environment variables
4. Deploy Node.js application
5. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment
Deploy to Vercel (recommended):
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on git push

## Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Stateless JWT authentication
- Efficient database queries with Prisma
- Next.js code splitting and optimization
- Tailwind CSS minification

## Admin Credentials (For Testing)

```
Email: admin@example.com
Password: AdminPass123!
Admin Key: helloAdmin753
```

**Note**: Create admin account through signup page with admin key

## Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_here
ADMIN_KEY=your_admin_key_here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Project Status

✅ Authentication (signup, login, logout)
✅ Product Management (CRUD operations)
✅ Shopping Cart (add, update, remove)
✅ Checkout & Orders
✅ Reports (SQL & MongoDB aggregations)
✅ Admin Dashboard
✅ Server-side Product Sorting
✅ Search & Filtering
✅ Pagination
✅ Comprehensive Testing
✅ Documentation
✅ Production-ready Structure

## Documentation

- **Backend**: `/backend/README.md` - API documentation, setup, testing
- **Frontend**: `/frontend/FRONTEND_README.md` - UI features, setup, deployment

## Key Requirements Met

✅ **Architecture**: MVC pattern with proper separation of concerns
✅ **Database**: PostgreSQL (SQL) + MongoDB (NoSQL)
✅ **Authentication**: JWT with bcrypt password hashing
✅ **Authorization**: Role-based access control (admin/customer)
✅ **Sorting**: Server-side sorting based on request headers
✅ **Reports**: SQL aggregation + MongoDB aggregation
✅ **Testing**: Jest with tests for auth, sorting, checkout
✅ **Security**: Input validation, secure passwords, protected routes
✅ **Performance**: Database indexes, pagination, caching
✅ **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
✅ **Deployment**: Ready for production deployment

## Troubleshooting

### Database Connection
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure MongoDB cluster is active
- Verify MONGO_URI in .env

### API Connection
- Check `NEXT_PUBLIC_API_URL` in frontend .env.local
- Ensure backend server is running
- Check CORS configuration
- Verify network requests in browser DevTools

### Build Issues
- Clear `.next`: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## Contributing

1. Create feature branch
2. Commit with meaningful messages
3. Push and create pull request

## License

ISC

## Support

For detailed information:
- Backend: See `/backend/README.md`
- Frontend: See `/frontend/FRONTEND_README.md`
- API: See backend README for complete API documentation
- Testing: See backend README for test details

---

**Created**: December 2025
**Status**: Production Ready ✅
