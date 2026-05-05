# Vercel Environment Variables Setup - Payment Integration

## Problem Fixed
After payment is completed successfully on Vercel, the redirect was failing because `PAYMENT_RETURN_URL` was pointing to `localhost:5173` which doesn't exist in production.

## Solution
Set the correct environment variables in Vercel dashboard for both **Backend** and **Frontend**.

---

## 1. Backend Environment Variables (Vercel Dashboard)

Go to your Vercel backend project → Settings → Environment Variables

Add these variables:

### Required for Production:
```
PAYMENT_RETURN_URL=https://your-frontend-domain.vercel.app/payment-success
WEBSITE_URL=https://your-frontend-domain.vercel.app
```

### Keep these as they are (from local .env):
```
PORT=5000
MONGO_URI=mongodb+srv://ujjal:computer12345@ecommerce.af4bldb.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=986546548983216545234

CLOUDINARY_NAME=dtrmlx164
CLOUDINARY_API_KEY=747816673324156
CLOUDINARY_API_SECRET=A-2ATu-lPz_AK2Gfd28ZKpAuLv4

EMAIL_USER=ujjalpandey12@gmail.com
EMAIL_PASS=hxps yhuu znvv kdpf

KHALTI_SECRET_KEY=1cccb5e551c44262a8272bb2c981e1d9
KHALTI_PUBLIC_KEY=45dc8e44f9ec45d59a6e8833189910c1
```

---

## 2. Find Your Frontend Domain

1. Go to **Vercel Dashboard** → **Frontend Project**
2. Look for the **Domains** section
3. Your domain will look like: `https://your-project-name.vercel.app`

**Example:**
```
PAYMENT_RETURN_URL=https://ecommerce-frontend-123abc.vercel.app/payment-success
WEBSITE_URL=https://ecommerce-frontend-123abc.vercel.app
```

---

## 3. Update Frontend API Base URL

Make sure your frontend is pointing to the correct backend API.

File: `frontend/Ecommerce/src/services/api.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://your-backend-domain.vercel.app/api";
```

Add to your `.env` file (frontend):
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

---

## 4. Payment Flow After Fix

1. User initiates payment
2. Khalti redirects to: `PAYMENT_RETURN_URL` (now set to your Vercel frontend domain)
3. PaymentSuccess page verifies payment with backend
4. Order status is updated
5. User is redirected to /orders page

---

## 5. Testing After Deployment

1. Deploy backend to Vercel
2. Deploy frontend to Vercel
3. Set environment variables in both projects
4. Test payment flow
5. Check Vercel logs if issues occur

### Check Logs:
- **Backend Logs**: Vercel → Backend Project → Logs
- **Frontend Logs**: Browser Console (F12)

---

## 6. If Payment Still Fails

Check these things:

1. ✅ `PAYMENT_RETURN_URL` is set correctly in backend env vars
2. ✅ `WEBSITE_URL` is set correctly in backend env vars
3. ✅ Frontend domain is accessible and not in preview/draft
4. ✅ Khalti API credentials are correct
5. ✅ Payment amount is in correct format (rupees, not paise)

---

## Local Development (No Changes Needed)

Your `.env` file already has localhost URLs for local development:
```
PAYMENT_RETURN_URL=http://localhost:5173/payment-success
WEBSITE_URL=http://localhost:5173
```

This works fine for local testing with `npm run dev`.
