# EssentiaMart - E-Commerce Platform

A fully functional, modern E-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). EssentiaMart features responsive design, robust backend architecture, role-based access control, and dynamic cloud asset management with integrated Khalti payment processing for Nepal-based transactions.

## 🚀 Key Features

- **Storefront**: Sleek, glassmorphism-inspired UI with modern animations and responsive design
- **Role-Based Access**: Specialized admin dashboard and client views with protected routes
- **Product Management**: Full CRUD capabilities for admins with Cloudinary image uploads
- **Shopping Cart**: Real-time cart state management using React Context API
- **Order Processing**: Complete checkout workflows with order tracking and status updates (Pending → Confirmed → Shipped → Out for Delivery → Delivered)
- **Payment Integration**: Khalti payment gateway for secure transactions
- **Authentication**: JWT-based session management with email verification
- **Admin Dashboard**: Real-time analytics, revenue tracking, and order management

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Lucide React Icons
- **Backend**: Node.js, Express, Mongoose, Multer
- **Database**: MongoDB Atlas
- **External APIs**: Cloudinary (image hosting), Khalti (payments)
- **Email Service**: Nodemailer (Gmail SMTP)

## Folder Structure

```
ecommerceproject/
├── backend/                  # Express/Node JS API
│   ├── config/               # Database and 3rd party configurations (Cloudinary, DB)
│   ├── controllers/          # Business logic for Auth, Products, and Orders
│   ├── middleware/           # Auth and Upload middleware (Multer)
│   ├── models/               # Mongoose Data Models
│   ├── routes/               # API endpoint definitions
│   └── server.js             # API entry point
└── frontend/Ecommerce/       # React SPA
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # Reusable React components (Navbar, ProductCard)
    │   ├── context/          # React Contexts (Auth, Cart)
    │   ├── pages/            # Application views (Home, Orders, Admin)
    │   └── services/         # Axios configuration and API wrappers
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection string.
- Cloudinary account credentials.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd ecommerceproject
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_uri
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend/Ecommerce
   npm install
   ```

### Running the Application Locally

You will need to run the client and the server concurrently.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend/Ecommerce
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173` (or next available port)

## 🔧 Environment Variables

### Backend `.env` file required variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_PUBLIC_KEY=your_khalti_public_key
PAYMENT_RETURN_URL=http://localhost:5173/payment-success
WEBSITE_URL=http://localhost:5173
```

### How to Get Credentials:
- **MongoDB**: Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com)
- **Khalti**: Register at [khalti.com](https://khalti.com) (Nepal payment gateway)
- **Gmail App Password**: Enable 2FA on Google Account → Generate app-specific password

## 📦 Deployment

### Deploy Backend to Vercel

1. **Create `vercel.json` in backend folder** (already included)

2. **Push code to GitHub**

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select `backend` folder as root directory
   - Add Environment Variables in Vercel dashboard:
     - Copy all values from your `.env` file
     - Update `PAYMENT_RETURN_URL` to your deployed frontend URL
     - Update `WEBSITE_URL` to your deployed frontend URL

4. **Get Vercel Backend URL** (e.g., `https://your-project.vercel.app`)

### Deploy Frontend to Vercel

1. **Update API endpoint** in `frontend/Ecommerce/src/services/api.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.vercel.app';
   ```

2. **Deploy Frontend:**
   - Import `frontend/Ecommerce` folder to Vercel
   - Add Environment Variable: `REACT_APP_API_URL=https://your-backend.vercel.app`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/:id` - Get user orders
- `GET /api/orders` - Get all orders (Admin)
- `PATCH /api/orders/:id` - Update order status (Admin)

### Payment
- `POST /api/payment/initiate` - Initiate Khalti payment
- `POST /api/payment/update` - Update payment status

## 🐛 Troubleshooting

### Connection Issues
- Verify MongoDB connection string is correct
- Check firewall settings for port 5000
- Ensure Cloudinary credentials are valid

### Payment Issues
- Verify Khalti keys are correct
- Check PAYMENT_RETURN_URL matches your frontend domain
- Review payment logs in browser console

### Image Upload Issues
- Ensure Cloudinary API credentials are correct
- Check file size limits (max 5MB recommended)
- Verify MIME type is image format

## 📄 License

This project is licensed under the MIT License.
