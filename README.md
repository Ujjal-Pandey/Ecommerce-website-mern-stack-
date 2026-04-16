# Next-Gen Tech E-Commerce Platform

A fully functional, modern E-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). This project showcases premium, responsive web design alongside robust backend architecture, role-based access control, and dynamic cloud asset management.

## Features

- **Storefront**: Sleek, glassmorphism-inspired UI with modern animations.
- **Role-Based Access**: Specialized views and actions for `Admin` and standard `Client` accounts.
- **Product Management**: Full CRUD capabilities for admins, including dynamic image uploads handled by Cloudinary.
- **Shopping Cart**: Real-time cart state management using React Context API.
- **Order Processing**: Secure checkout workflows and order tracking.
- **Authentication**: JWT-based session management.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Lucide React (Icons).
- **Backend**: Node.js, Express, Mongoose, Multer (Local Temp Storage).
- **Database**: MongoDB.
- **External APIs**: Cloudinary (for scalable image hosting).

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

*In the `backend` terminal:*
```bash
npm run dev
```

*In the `frontend` terminal:*
```bash
npm run dev
```
The app should now be running cleanly on `localhost`!

## License

This project is licensed under the MIT License.
