# FORME® — Enterprise D2C Clothing & Lifestyle E-Commerce Platform

React + Vite + TypeScript + Tailwind CSS + React Router + Zustand + React Hook Form/Zod + Razorpay + Supabase.
Production-ready e-commerce platform with Shopify-like management capabilities.

---

## Quick Start (Demo Mode, No Setup Needed)
```bash
npm install
npm run dev
```
- Open `http://localhost:5173`
- Run flow tests: `npm test`
- Type-check and production build: `npm run build`

---

## Master Architecture & Feature Guide

### 1. Typography & Visual Identity
- **Readable Luxury Typography**: Standardized across the entire platform on **Inter** with crisp kerning, high legibility, and proportional line heights (`1.15`).
- **FORME® Pure Brand Identity**: All third-party and placeholder brand names (Gucci, Zara, Versace, Prada, Calvin Klein) have been completely removed and replaced with authentic FORME® signature elements and sustainability values (100% Organic Cotton, 240+ GSM, Handcrafted in India, Express Courier).

### 2. Customer-Facing Storefront
- **Instant Product Search**: Autocomplete dropdown showing real-time thumbnail previews, titles, categories, and prices.
- **Product Filtering & Sorting**: Filter by category, price range (Under ₹1,000, ₹1,000–₹2,500, Above ₹2,500), size, color swatch, and in-stock status. Sort by Popularity, Best Sellers, and Price.
- **Interactive Size & Fit Guide**: Modal detailing Chest, Shoulder, Length, and Sleeve measurements for all garments.
- **PIN Code Delivery Serviceability**: Validates 6-digit Indian postal codes via Postal API with estimated courier delivery dates.
- **Product Gallery**: High-resolution image zoom, multi-angle thumbnails, discount pills, and low-stock urgency badges.
- **Shopping Bag & "Save for Later"**: Real-time stock reservation, free shipping tier tracker, and dedicated "Save for Later" shelf with 1-click cart transfer.
- **Recently Viewed & Related Recommendations**: Persists recently viewed items across sessions and surfaces them on PDP and Homepage.
- **Ratings & Reviews**: 5-star customer review submission with verified buyer badges.
- **Direct WhatsApp Concierge**: Instant enquiry button with pre-filled product/cart details.

### 3. Customer Account Dashboard
- **Live 4-Step Order Tracking**: Visual progression (`Placed` → `Packed` → `Shipped` → `Delivered`) with courier partner name and live tracking AWB link.
- **Self-Service Returns & Exchanges**:
  - Request Cancellation with predefined reason codes.
  - Request Return for Refund or Exchange for alternative size (S/M/L/XL/XXL).
- **Downloadable Branded Tax Invoices**: Generates printable official GST tax invoices with itemized breakdowns and company registration details.
- **Saved Address Book**: Multi-address management (Home, Office, Other) with default address selector and checkout autofill.
- **Wishlist & Customer Reviews**: Dedicated tabs to review saved bookmarks and inspect submitted product ratings.
- **FORME® Rewards & Referral Program**: Earn 1 point per ₹100 spent, redeemable for checkout credits, plus custom shareable referral codes.

### 4. Enterprise Admin Panel
- **Discreet Entry**: Subtle lock icon in bottom-left corner (`fixed bottom-3 left-3 z-40`) with server-side role authentication.
- **Command Dashboard**:
  - Net Revenue, Gross Revenue, Refunded Amount, and Total Orders.
  - Average Order Value (AOV), Cancellation Rate, Return Rate, and Store Conversion Rate.
  - Interactive Sales Revenue timeline (7 Days, 30 Days, 90 Days).
  - 1-Click **Export Sales (CSV)** with complete customer and line-item details.
  - Best-Selling Products ranking and Low-Stock Alert center.
- **Product & Inventory Management**:
  - Multi-image uploads, shipping weight in grams, SKU, category tags, care instructions, and model sizing.
  - Inline `+5` and `-1` stock adjusters.
  - Instant product search and `⚠️ Low Stock (≤ 5)` quick filter.
  - Published vs. Draft visibility toggle.
- **Order Management & Logistics**:
  - Courier assignment (BlueDart, Delhivery, Shiprocket, DTDC) with AWB tracking code generation.
  - Return and exchange request review and approval workflow.
  - Real Razorpay Gateway Refund trigger with reason and custom amount.
- **Customer Relationship Management (CRM)**:
  - Registered customers directory with order history, lifetime spend, and account status (`Active`, `VIP`, `Flagged`).
  - Customer Profile Modal showing full order history and address details.
- **Advanced Coupon Engine**:
  - Percentage and flat discounts.
  - Cart minimum spend thresholds (`minOrderValue`).
  - Maximum discount caps (`maxDiscount`).
  - Expiry date controls and Free Shipping coupon rules.
- **Marketing & Automations**:
  - Real-time abandoned cart tracking with recoverable value KPI.
  - 1-Click abandoned cart recovery emails with private promo codes.
  - Promotional email broadcasting to custom customer segments.

---

## Payment & Gateway Integration (Razorpay)

### Serverless API Endpoints (`/api/razorpay/*`)
1. **`POST /api/razorpay/create-order`**: Creates secure server-side Razorpay order in INR paise.
2. **`POST /api/razorpay/verify-payment`**: Verifies `razorpay_signature` using HMAC SHA-256 and constant-time comparison (`crypto.timingSafeEqual`).
3. **`POST /api/razorpay/refund`**: Dispatches official gateway refund requests to `POST https://api.razorpay.com/v1/payments/{paymentId}/refund`.
4. **`POST /api/razorpay/webhook`**: Asynchronous webhook handler for `payment.captured`, `payment.failed`, and `refund.processed`.

### Test Credentials
Pre-configured for risk-free testing in demo environments:
- **Key ID**: `rzp_test_U21pkx7bHuf4L0`
- **Key Secret**: Configured securely in serverless environment variables (`RAZORPAY_KEY_SECRET`).

---

## Deployment to Vercel

The project is pre-configured with [vercel.json](file:///c:/Users/Gulshan/OneDrive/Desktop/forme/vercel.json) for 1-click deployment with the project name `forme`:

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables on Vercel:
| Variable | Description |
| :--- | :--- |
| `VITE_BRAND_SLUG` | `forme` |
| `VITE_WHATSAPP_NUMBER` | `919876543210` |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_U21pkx7bHuf4L0` |
| `RAZORPAY_KEY_SECRET` | Serverless Razorpay Secret Key |
| `RAZORPAY_WEBHOOK_SECRET`| Webhook verification secret |
| `VITE_SUPABASE_URL` | (Optional) Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | (Optional) Supabase anon public key |

---

## Automated Test Suite
Run the 9 end-to-end integration tests:
```bash
npm test
```
- Guest checkout with coupon validation and stock decrement
- Product review submission
- Customer registration and account dashboard
- Admin product catalogue creation
- Admin coupon and multi-rule discount management
- Shop category, price, and variant filtering
- Discreet admin portal security
- Interactive size guide and technical specifications
