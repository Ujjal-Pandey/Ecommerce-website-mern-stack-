# 🔌 API Routes - Complete Reference

## Backend Routes Summary

### 1. Auth Routes
```
POST   /api/auth/register          Create new account
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user info (protected)
POST   /api/auth/forgot-password   Send reset email
POST   /api/auth/reset-password    Reset password with token
```

### 2. Product Routes
```
GET    /api/products               Get all products
GET    /api/products/:id           Get single product
POST   /api/products               Create product (admin only)
PUT    /api/products/:id           Update product (admin only)
DELETE /api/products/:id           Delete product (admin only)
```

### 3. Order Routes
```
POST   /api/orders                 Create order (protected)
GET    /api/orders/myorders        Get my orders (protected)
GET    /api/orders/:id             Get single order by ID (protected)
GET    /api/orders/admin/all       Get all orders (admin only)
PUT    /api/orders/:id/status      Update order status (admin only)
PUT    /api/orders/:id/payment-status  Update payment status ⭐ FIXED
PUT    /api/orders/:id/cancel      Cancel order (protected)
```

### 4. Payment Routes ⭐
```
POST   /api/payment/initiate       Initiate Khalti payment (protected)
POST   /api/payment/lookup         Verify Khalti payment (protected)
```

---

## Payment Flow Endpoints in Detail

### 📍 Step 1: Initiate Payment
**Endpoint:** `POST /api/payment/initiate`
**Auth:** Required (Bearer Token)
**Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "productName": "E-Commerce Order",
  "amount": 5000,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9800000000"
}
```
**Response:**
```json
{
  "pidx": "G8rM2S3P",
  "payment_url": "https://dev.khalti.com/epayment/initiate/G8rM2S3P"
}
```

### 📍 Step 2: Create Order (Before Payment)
**Endpoint:** `POST /api/orders`
**Auth:** Required (Bearer Token)
**Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "total": 5000,
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9800000000",
    "address": "Test Address",
    "city": "Kathmandu",
    "postalCode": "44600"
  }
}
```
**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439010",
  "items": [...],
  "total": 5000,
  "status": "Pending",
  "paymentStatus": "Pending",
  "shippingAddress": {...},
  "createdAt": "2024-05-01T10:00:00Z"
}
```

### 📍 Step 3: Verify Payment
**Endpoint:** `POST /api/payment/lookup`
**Auth:** Required (Bearer Token)
**Body:**
```json
{
  "pidx": "G8rM2S3P"
}
```
**Response:**
```json
{
  "pidx": "G8rM2S3P",
  "total_amount": 5000,
  "status": 200,
  "transaction_id": "1234567890",
  "tidx": "507f1f77bcf86cd799439013",
  "amount": 5000,
  "payment_status": "Completed",
  "message": "Payment Completed"
}
```

### 📍 Step 4: Update Payment Status ⭐ FIXED
**Endpoint:** `PUT /api/orders/:id/payment-status`
**Auth:** NOT Required (frontend passes as public route)
**URL Parameter:**
```
:id = Order ID (e.g., 507f1f77bcf86cd799439011)
```
**Body:**
```json
{
  "paymentStatus": "Completed",
  "paymentId": "1234567890",
  "orderId": "507f1f77bcf86cd799439011"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment updated to Completed. Order status: Confirmed",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "paymentStatus": "Completed",
    "status": "Confirmed",
    ...
  }
}
```

---

## Frontend API Calls

### From PaymentButton.jsx
```javascript
// Step 1: Initiate Payment
POST /api/payment/initiate
{
  orderId: "507f1f77bcf86cd799439011",
  productName: "E-Commerce Order",
  amount: 5000,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "9800000000"
}
```

### From PaymentSuccess.jsx
```javascript
// Step 1: Verify Payment with Khalti
POST /api/payment/lookup
{
  pidx: "G8rM2S3P"
}

// Step 2: Update Order Payment Status
PUT /api/orders/507f1f77bcf86cd799439011/payment-status
{
  paymentStatus: "Completed",
  paymentId: "1234567890",
  orderId: "507f1f77bcf86cd799439011"
}
```

### From Checkout.jsx
```javascript
// Step 1: Create Order
POST /api/orders
{
  items: [{product: "...", quantity: 2}],
  total: 5000,
  shippingAddress: {...}
}
```

---

## Database Models

### Order Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Reference to User
  items: [
    {
      product: ObjectId,    // Reference to Product
      qty: Number
    }
  ],
  total: Number,
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled",
  paymentStatus: "Pending" | "Completed" | "Failed",
  paymentId: String,        // Khalti transaction ID
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "message": "Order ID is required"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authenticated. Please login."
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to view this order"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Order not found"
}
```

### 500 Server Error
```json
{
  "message": "Failed to update payment status"
}
```

---

## Middleware Applied

### `protect` - Authentication Middleware
- Verifies JWT token from `Authorization: Bearer <token>`
- Sets `req.user` to decoded user data
- Required for: Create Order, Initiate Payment, Verify Payment

### `admin` - Admin Authorization Middleware
- Checks if user role is 'admin'
- Required for: Get all orders, Update order status, Admin products

---

## Testing with Postman/Curl

### 1. Test Order Creation
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product": "PRODUCT_ID", "quantity": 1}],
    "total": 1000,
    "shippingAddress": {
      "fullName": "Test",
      "email": "test@example.com",
      "phone": "9800000000",
      "address": "Test",
      "city": "Kathmandu"
    }
  }'
```

### 2. Test Payment Status Update
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/payment-status \
  -H "Content-Type: application/json" \
  -d '{
    "paymentStatus": "Completed",
    "paymentId": "TEST_TRANSACTION_ID",
    "orderId": "ORDER_ID"
  }'
```

---

## Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | GET order details |
| 201 | Created - New resource created | POST new order |
| 400 | Bad Request - Invalid data | Missing required field |
| 401 | Unauthorized - No auth token | Missing Bearer token |
| 403 | Forbidden - Not authorized | Non-admin accessing admin route |
| 404 | Not Found - Resource missing | Order ID doesn't exist |
| 500 | Server Error - Internal error | Database connection failed |

---

## ✅ Verification Checklist

- [x] Order creation endpoint works
- [x] Payment initiation endpoint works
- [x] Payment lookup endpoint works
- [x] Payment status update endpoint receives orderId from URL param ⭐
- [x] Order status updates to "Confirmed" on payment completion
- [x] Frontend passes orderId correctly to all endpoints
- [x] Error handling and logging in place
