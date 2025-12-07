# E-Commerce Backend API

A production-ready Node.js + Express backend for a full-stack e-commerce application featuring product management, shopping cart, order checkout, and advanced reporting.

## Overview

This backend server provides RESTful API endpoints for:
- **Authentication**: User registration and login with JWT tokens
- **Product Management**: Create, read, update, delete products (admin only)
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Processing**: Checkout with server-side total calculation
- **Reports**: SQL and MongoDB aggregations for business analytics

## Tech Stack & Dependencies

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **SQL Database**: PostgreSQL (via Prisma ORM)
- **NoSQL Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Security**: bcryptjs 3.0.3
- **CORS**: cors 2.8.5

### Development & Testing
- **ORM**: Prisma 6.19.0 with @prisma/client 6.19.0
- **Testing Framework**: Jest 29.7.0
- **HTTP Testing**: supertest 6.3.3
- **Environment Management**: dotenv 17.2.3

### Installed Packages
```json
{
  "dependencies": {
    "@prisma/client": "^6.19.0",
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongodb": "^7.0.0",
    "mongoose": "^9.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "prisma": "^6.19.0",
    "supertest": "^6.3.3"
  }
}
```

## Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend root directory with the following variables:

```env
# Server Port
PORT=3000

# PostgreSQL Database (Prisma)
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Admin Registration Key
ADMIN_KEY=your_admin_key_here
```

### Environment Variables Explained
- **PORT**: Server port (default: 3000)
- **DATABASE_URL**: PostgreSQL connection string for user, order, and cart data
- **MONGO_URI**: MongoDB connection for product catalog
- **JWT_SECRET**: Secret key for signing JWT tokens (generate with strong random string)
- **ADMIN_KEY**: Secret key for admin registration (share with admin users only)

## Database Configuration & Migration

### PostgreSQL Schema (via Prisma)

The application uses Prisma ORM for PostgreSQL. Tables include:

- **users**: User accounts with roles (admin/customer)
- **orders**: Order records with total amount
- **order_items**: Order line items with price snapshots
- **cartItems**: Shopping cart items per user

### MongoDB Schema (Mongoose)

Products are stored in MongoDB with these fields:
- **_id**: MongoDB ObjectId
- **sku**: Stock Keeping Unit (indexed, unique)
- **name**: Product name
- **price**: Product price
- **category**: Product category (indexed)
- **updatedAt**: Last update timestamp (indexed)
- **createdAt**: Creation timestamp

### Running Migrations

#### First-time Setup:
```bash
# Set up PostgreSQL database
npx prisma migrate dev --name init

# Seed sample data (if seed script exists)
npm run seed
```

#### After Schema Changes:
```bash
npx prisma migrate dev --name <migration_name>
```

#### View Database:
```bash
# Open Prisma Studio
npx prisma studio
```

### Database Indexes

For optimal performance, the following indexes are configured:

**MongoDB Products:**
- `sku` (unique index)
- `category` (regular index)
- `updatedAt` (regular index)

**PostgreSQL (Prisma handles automatically):**
- `User.email` (unique)
- `User.id` (primary key)
- `Order.userId` (foreign key)
- `OrderItem.orderId` (foreign key)

## API Routes

### Authentication Routes `/api/auth`

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "adminkey": "helloAdmin753"  // Optional - omit for customer role
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully with role customer"
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Log Out
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "message": "Logout successful"
}
```

### Product Routes `/api/products`

#### Get Products (Public)
Supports server-side sorting based on request headers.

```http
GET /api/products?search=laptop&category=electronics&page=1&limit=10
X-Sort: asc

# Query Parameters:
# - search: Search by product name or SKU
# - category: Filter by category
# - page: Page number (default: 1)
# - limit: Items per page (default: 10)

# Headers:
# - X-Sort: "asc" for ascending price, omit or "desc" for descending (default)
```

**Response** (200 OK):
```json
{
  "total": 25,
  "page": 1,
  "limit": 10,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "sku": "LAP001",
      "name": "Laptop Pro",
      "price": 999,
      "category": "electronics",
      "createdAt": "2025-12-06T10:00:00Z",
      "updatedAt": "2025-12-06T10:00:00Z"
    }
  ]
}
```

#### Create Product (Admin Only)
```http
POST /api/products/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "sku": "LAP001",
  "name": "Laptop Pro",
  "price": 999,
  "category": "electronics"
}
```

**Response** (201 Created):
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "sku": "LAP001",
    "name": "Laptop Pro",
    "price": 999,
    "category": "electronics"
  }
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/update/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Laptop Pro Max",
  "price": 1099
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/delete/:id
Authorization: Bearer <admin_token>
```

### Cart Routes `/api/cart`

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": 1,
      "userId": 1,
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ]
}
```

#### Remove from Cart
```http
DELETE /api/cart/:id
Authorization: Bearer <token>
```

### Checkout Route `/api/checkout`

#### Create Order
```http
POST /api/checkout
Authorization: Bearer <token>
Content-Type: application/json
```

**Response** (201 Created):
```json
{
  "message": "Order placed successfully",
  "order": {
    "id": 1,
    "userId": 1,
    "total": 1998,
    "createdAt": "2025-12-06T10:30:00Z"
  },
  "items": [
    {
      "orderId": 1,
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "priceAtPurchase": 999
    }
  ]
}
```

### Reports Route `/api/reports`

#### Get Reports (Admin Only)
```http
GET /api/reports
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
{
  "sqlReport": [
    {
      "date": "2025-12-06",
      "total_revenue": "4995.00"
    }
  ],
  "mongoReport": [
    {
      "_id": "electronics",
      "totalProducts": 15
    },
    {
      "_id": "books",
      "totalProducts": 8
    }
  ]
}
```

## Testing Instructions

### Running Tests

```bash
# Run all tests with coverage
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/auth.test.js
```

### Test Files & Coverage

All test files are in `/backend/tests/`:

#### 1. **auth.test.js** - Authentication Tests
- JWT token generation and verification
- Password hashing with bcrypt
- Token expiration and validation
- Invalid token rejection

**What it tests**: Ensures secure authentication with proper token handling and password hashing.

#### 2. **sorting.test.js** - Product Sorting Tests (Server-Side)
- Default descending price sorting
- Ascending price sorting with `x-sort: asc` header
- Sorting with pagination
- Category filtering with sorting
- Search functionality with sorting
- Price tie handling

**What it tests**: Verifies that product sorting is implemented on the server side and responds correctly to the `X-Sort` header. This is critical as per requirements - sorting must happen server-side, not client-side.

#### 3. **checkout.test.js** - Checkout & Order Tests
- Order total calculation
- Cart validation before checkout
- Order item creation with price snapshots
- Cart operations (add, update, remove items)
- Order validation

**What it tests**: Ensures correct order processing, including server-side total calculation and proper cart management.

### Test Coverage Output

Running `npm run test` generates a coverage report showing:
- Statement coverage (code executed)
- Branch coverage (conditional paths)
- Function coverage (functions called)
- Line coverage (lines executed)

## Security Considerations

1. **Password Hashing**: All passwords are hashed with bcryptjs before storage
2. **JWT Authentication**: Protected routes verify JWT tokens in the Authorization header
3. **Role-Based Access Control**: Admin-only routes check user role
4. **Input Validation**: All inputs are validated before database operations
5. **Environment Variables**: Sensitive data (DATABASE_URL, JWT_SECRET) stored in .env
6. **CORS**: Configured with proper origin restrictions
7. **Database Indexing**: Optimized queries with indexed fields

## Deployment

### Prerequisites for Deployment
- PostgreSQL database (Railway, AWS RDS, etc.)
- MongoDB Atlas account (free tier available)
- Node.js hosting (Render, Railway, Heroku, AWS)

### Deployment Steps

1. **Create a .env file** on your hosting platform with production values
2. **Run migrations** on production database: `npx prisma migrate deploy`
3. **Start the server**: `npm start`
4. **Update frontend** with production API URL

### Example Deployment on Render

1. Connect GitHub repository to Render
2. Create a PostgreSQL database on Render
3. Set environment variables in Render dashboard
4. Deploy automatically on git push

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Use different port
PORT=4000 npm start
```

**Database Connection Error**
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Verify MongoDB Atlas cluster is active

**Token Verification Failed**
- Ensure JWT_SECRET matches between signup and login
- Check token hasn't expired (7 days validity)

**Admin Registration**
- Use correct ADMIN_KEY from .env
- Verify adminkey is passed during signup

## Admin Login Credentials

For testing and evaluation:

```
Email: admin@example.com
Password: AdminPass123!
Admin Key: helloAdmin753
Role: admin
```

**Note**: Create an admin account using the signup endpoint with the provided ADMIN_KEY.

## Project Structure

```
backend/
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── checkoutController.js
│   └── reportController.js
├── middleware/         # Authentication & authorization
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/            # Database models
│   └── productModel.js
├── routes/            # API endpoints
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── checkoutRoutes.js
│   ├── reportRoutes.js
│   └── orderRoutes.js
├── prisma/            # Prisma schema & migrations
│   ├── schema.prisma
│   └── migrations/
├── tests/             # Test files
│   ├── auth.test.js
│   ├── sorting.test.js
│   └── checkout.test.js
├── .env               # Environment variables
├── server.js          # Express app entry point
├── package.json       # Dependencies
└── jest.config.js     # Jest configuration
```

## Performance Optimization

1. **Database Indexes**: Frequently queried fields are indexed
2. **Pagination**: Products endpoint supports pagination to limit data transfer
3. **JWT Tokens**: Stateless authentication reduces database queries
4. **Caching**: Consider implementing Redis for high-traffic scenarios
5. **Query Optimization**: Use Prisma's select/include for specific fields

## Contributing

1. Create a feature branch
2. Make changes with meaningful commits
3. Test with `npm run test`
4. Submit pull request

## License

ISC

## Contact & Support

For issues or questions, refer to the API documentation above or check the test files for usage examples.
