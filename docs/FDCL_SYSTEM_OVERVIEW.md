# Focus Digital Color Lab — Complete System Overview

### For the Owner: Every Feature, Every Role, Every Capability

---

## Table of Contents

1. [What Is FDCL?](#1-what-is-fdcl)
2. [Who Uses the System?](#2-who-uses-the-system)
3. [What Services FDCL Offers](#3-what-services-fdcl-offers)
4. [What Customers Can Do](#4-what-customers-can-do)
5. [What Staff Can Do](#5-what-staff-can-do)
6. [What Admin Can Do](#6-what-admin-can-do)
7. [Order Lifecycle](#7-order-lifecycle)
8. [Payment System](#8-payment-system)
9. [Photo ID / Registry System](#9-photo-id--registry-system)
10. [Delivery & Pickup](#10-delivery--pickup)
11. [Studio Appointments](#11-studio-appointments)
12. [Notifications (SMS & Email)](#12-notifications-sms--email)
13. [Reports & Analytics](#13-reports--analytics)
14. [Third-Party Integrations](#14-third-party-integrations)
15. [Technical Infrastructure](#15-technical-infrastructure)

---

## 1. What Is FDCL?

**Focus Digital Color Lab** is a full-stack digital photo lab management system. It operates across multiple physical studio locations and handles:

- Online and walk-in photo print orders
- Studio appointment booking
- Multi-location staff and inventory management
- Pathao-powered home delivery
- Customer photo storage with reusable Photo IDs
- Full financial tracking per order

The system has three distinct user roles — **Customer**, **Staff**, and **Admin** — each with their own dedicated dashboard and capabilities.

---

## 2. Who Uses the System?

| Role         | Who They Are                          | How They Access                                        |
| ------------ | ------------------------------------- | ------------------------------------------------------ |
| **Customer** | Retail clients who place photo orders | Website (register/login or Google OAuth)               |
| **Staff**    | Lab technicians and counter staff     | Staff dashboard (assigned to a location)               |
| **Admin**    | Lab owner, managers                   | Admin dashboard (full access)                          |
| **Walk-in**  | Customers without an account          | Created by staff on-site; can have login enabled later |

---

## 3. What Services FDCL Offers

x

### Photo Printing (Reprint)

- Print photos in various sizes (4×6, 5×7, 8×10, and more)
- Paper type choice: **Glossy** or **Matte**
- Customer provides photo by: upload, Photo ID, or "studio capture (awaiting) - staff will upload after photo retouch photo" (bring later)
- Minimum quantities and step increments per product

### Photo Albums

- Bound custom photo albums
- Multiple size options
- Customer describes photo source or uploads photos

### Photo Frames

- Ready-made frames in various dimensions
- Customer uploads or describes the photo source

### Photo Mugs

- Personalized mugs with custom photos
- Upload or describe photo source

### Photo Studio Sessions

- Appointment-based in-studio photography
- Service types offered:
  - General portraits
  - Passport photos
  - Visa photos
  - Family portraits
  - Event photography
  - School photos
- Studio fee charged per session (configurable per location)

---

## 4. What Customers Can Do

### Account & Registration

- Register with phone number, email, name, address, and password
- Phone OTP verification on signup (5-minute expiry, max 5 attempts)
- Sign in with Google (Google OAuth)
- Login with phone or email + password
- Reset password via phone OTP
- Update profile (name, email, address)
- Change phone number with OTP verification
- Delete account

### Placing Orders

Customers can place orders for:

| Service       | Upload Photo? | Use Photo ID? | Notes                       |
| ------------- | ------------- | ------------- | --------------------------- |
| Photo Reprint | Yes           | Yes           | Paper type, size, quantity  |
| Photo Album   | Optional      | No            | Describe photo source       |
| Photo Frame   | Yes           | No            | Optional source description |
| Photo Mug     | Yes           | No            | Optional source description |

Every order form includes:

- Product and quantity selection
- Pickup method: **studio pickup** or **home delivery**
- Delivery address (flat, road, block, postal code)
- Delivery type: **Regular** (৳70) or **Express** (৳120)
- Special instructions to staff
- BKash payment reference (for pre-payment proof)

### Booking Studio Appointments

- Select service type (passport, visa, family, etc.)
- Choose date and time
- Provide contact info (name, phone, email)
- Select studio location

### Tracking Orders

- View all past and current orders in dashboard
- See full order status: Pending → Processing → Ready → Out for Delivery → Delivered
- Track payment status: Unpaid, Partial, Paid
- View delivery tracking (Pathao consignment updates)
- Download invoice as PDF
- View public invoice link (shareable, time-limited token)

### Photo ID / Registry

- View all Photo IDs stored for their account
- See which orders each Photo ID was used in
- Track Photo ID expiry dates (valid 1–3 years)

---

## 5. What Staff Can Do

### Dashboard & Order Queue

- See all orders for their assigned location
- Filter orders by: status, date range (today / this week / this month), or free-text search (order number, customer name, phone)
- Paginated view (20 orders per page)
- Quick glance at each order: items, service types, photo readiness

### Creating Walk-In Orders

For customers who walk in without placing an order online:

- Search existing customers by name or phone
- Create new customer on the spot (name + phone required)
- Add multiple services to one order: reprint, album, frame, mug
- For reprint items, specify:
  - Photo source: existing Photo ID, manual photo description, upload, or "studio capture (awaiting) - [staff will upload after photo retouch]"
  - Paper type (glossy/matte)
  - Quantity and product size
- Set pickup or home delivery
- Apply manual discount
- Record immediate payment (cash/BKash/Nagad/card/other)
- Charge studio fee (per session, location-specific)

### Managing Existing Orders

For every order, staff can:

- **Upload photos** to items that are "studio capture (awaiting) - staff will upload after photo retouch photo" — automatically creates a Photo ID
- **Update order status** through the pipeline (pending → processing → ready → dispatched → delivered)
- **Record payments** at any time (partial or full)
- **Add/edit notes** for internal reference
- **Send Invoice SMS** — sends the customer a tokenized invoice link via SMS
- **Send Order-Ready SMS** — notifies customer their order is ready for pickup
- **Dispatch via Pathao** — enter item weight/type, create shipment, auto-update order to "Out for Delivery"

### Customer Management (Staff)

- Browse all customers (walk-in and registered)
- Filter: walk-in only, login enabled, login disabled
- Search by name or phone
- View each customer's:
  - Full profile
  - Complete order history with totals and payment status
  - All Photo IDs (owned and shared), with expiry
- Edit customer info (name, address, email, phone)
- **Enable login** for walk-in customers: set email + password so they can access the website
- **Reset password** for a customer
- **Activate/deactivate** customer account

### Photo Storage Management

- Central view of all Photo IDs (registries) in the system
- Filter by status: active or expired
- Filter by customer association: registered or anonymous
- Search by Photo ID code
- View each Photo ID: all photos, linked customer, used in which orders, expiry date
- Download individual photos or the whole registry

### Appointment Management

- View all upcoming and past appointments
- See service type, customer name, phone, location, date/time
- Update appointment status: attended or cancelled

---

## 6. What Admin Can Do

Admin has all staff capabilities plus the following:

### Admin Dashboard (Analytics at a Glance)

Top-level KPI cards:

- Today's orders and today's revenue
- Pending orders count
- Total unpaid balance outstanding
- Monthly revenue (current month vs. previous month)
- New customers this month
- Count of overdue unpaid orders
- Today's appointments and this week's appointments
- Studio attendance rate

Charts and breakdowns:

- 7-day order volume chart (bar/line)
- Revenue by service category (reprint, album, frame, mug, studio)
- Revenue by studio location
- 6-month revenue trend
- Payment method breakdown (cash, BKash, Nagad, card)
- Top 5 products by revenue
- Order status distribution
- Recent orders list

### Product Catalog Management

Full control over what is sold:

- Create, edit, delete any product
- Toggle products active/inactive (hide without deleting)
- Reorder products via drag-and-drop (controls display order on customer site)
- Product attributes manageable:
  - Name and emoji flag
  - Category: Reprint, Album, Frame, Mug, Studio, Print
  - Size label (e.g., "4×6 inches")
  - Physical dimensions (width × height in mm)
  - Price
  - Copies per sheet
  - Minimum quantity
  - Quantity step increment
  - Description
- Filter product list by category and active/inactive status

### Staff & Admin User Management

- Create new staff or admin accounts
- Assign each user to a studio location
- Default password set (Staff@1234, must be changed on first login)
- Toggle any user's access on/off (without deleting the account)
- View each user's details and their assigned location

### Order Visibility (All Locations)

- View every order across all locations (not just one)
- Search by order number or customer info
- Filter by status and location
- View full order details

### Report Generation

Four report types, each filterable by date range and location:

| Report                 | What It Shows                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **Sales Report**       | Order number, date, customer, location, items, total, paid, balance, statuses           |
| **Appointment Report** | Date, time, service, customer name/phone, location, status, booked by                   |
| **Customer Report**    | Name, phone, type (walk-in or registered), order count, total spending, last order date |
| **Product Report**     | Product name, category, size, units sold, revenue, number of orders                     |

Export formats: **CSV** (for Excel/Sheets) or **PDF** (branded, print-ready)

### Studio Fee Management

- Set the session fee for each studio location
- Toggle fees active/inactive
- View all current studio fees at a glance

### SMS Balance Check

- View current remaining SMS credit from BulkSMS provider
- Available directly from admin dashboard

---

## 7. Order Lifecycle

```
Customer places order (online or walk-in)
          ↓
     [PENDING]
     Staff reviews order
          ↓
    [PROCESSING]
     Staff prepares prints/products
          ↓
      [READY]
     Items ready for pickup or dispatch
          ↓
  ┌───────────────────────┐
  │                       │
[OUT FOR DELIVERY]    [DELIVERED]
  (Pathao dispatched)   (Picked up at studio)
  via Pathao webhook
          ↓
     [DELIVERED]

          OR at any stage →→→ [CANCELLED]
```

**Valid status transitions enforced by the system:**

- Pending → Processing or Cancelled
- Processing → Ready or Cancelled
- Ready → Out for Delivery, Delivered, or Cancelled
- Out for Delivery → Delivered or Cancelled
- Delivered and Cancelled are terminal states

---

## 8. Payment System

### Payment Methods Accepted

- Cash
- BKash (with transaction reference)
- Nagad
- Card
- Other

### How It Works

- Each payment is recorded individually (multiple partial payments allowed)
- Every payment logs: amount, method, reference, notes, who recorded it, timestamp
- Order has cumulative `amount_paid` tracked automatically
- Payment status auto-calculates: **Unpaid**, **Partial**, or **Paid**

### Order Pricing

- Products have fixed unit prices
- Item subtotal = unit price × quantity
- Order total = sum of all items + delivery fee − manual discount
- Delivery fees: Regular ৳70, Express ৳120, Studio pickup ৳0
- Studio session fee added for walk-in studio visits

---

## 9. Photo ID / Registry System

FDCL's Photo ID system lets customers store their photos and reuse them across orders.

### How It Works

1. Customer uploads a photo with an order (or staff uploads after customer brings it)
2. System assigns an 8-character uppercase **Photo ID** (e.g., `ABCD1234`)
3. Photo ID is linked to the customer's account
4. Photo stored securely in Backblaze B2 cloud storage
5. Expiry: 1–3 years (configurable)
6. Customer or staff can reference this Photo ID in any future order — no re-upload needed

### Benefits

- Customer never loses their lab photos
- Staff can quickly reprint without searching for the original
- Reduces upload overhead for repeat customers
- Works across multiple orders and even across customers (with permission)

---

## 10. Delivery & Pickup

### Studio Pickup

- Customer selects which FDCL location to collect from
- Staff notifies customer when ready (SMS)
- Customer shows up and collects

### Home Delivery (via Pathao)

- Customer provides: flat number, road, block, postal code, delivery instructions
- Two speed options:
  - **Regular Delivery** — ৳70
  - **Express Delivery** — ৳120
- Staff dispatches via Pathao directly from the order panel
- Staff selects item type (document/parcel) and weight
- Pathao consignment ID auto-stored on order
- Order status auto-updates as Pathao sends delivery webhooks

---

## 11. Studio Appointments

### Booking Flow

- Customer selects service type (general, passport, visa, family, event, school)
- Picks date and time
- Provides name, phone, email
- Selects studio location

### Staff Management

- All appointments visible to staff at their location
- Staff marks each as attended or cancelled after the session
- Admin sees attendance rate analytics on dashboard

---

## 12. Notifications (SMS & Email)

### SMS (via BulkSMS API)

| Event              | Recipient | Content                     |
| ------------------ | --------- | --------------------------- |
| Registration OTP   | Customer  | OTP code (5-min expiry)     |
| Password Reset OTP | Customer  | OTP code (5-min expiry)     |
| Invoice link       | Customer  | Tokenized invoice URL       |
| Order Ready        | Customer  | Order number + invoice link |

### Email (via SMTP)

| Event            | Recipient |
| ---------------- | --------- |
| Order Confirmed  | Customer  |
| Order Processing | Customer  |
| Order Ready      | Customer  |
| Order Delivered  | Customer  |
| Order Cancelled  | Customer  |

### Delivery Webhook

- Pathao sends real-time delivery updates to a secure webhook endpoint
- Order status syncs automatically when delivery is confirmed

---

## 13. Reports & Analytics

### Admin Dashboard (Live)

Always up-to-date view of:

- Revenue today, this month, vs. last month
- Orders by status, location, service category
- Customer acquisition rate
- Unpaid order exposure
- Top-performing products
- Payment method popularity

### Downloadable Reports

All reports support:

- **Date range filtering** (any start/end date)
- **Location filtering** (all or specific branch)
- **Export as CSV** (open in Excel or Google Sheets)
- **Export as PDF** (branded, ready to print or email)

---

## 14. Third-Party Integrations

| Service            | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| **Google OAuth**   | Customers sign in with Google                  |
| **BulkSMS**        | SMS OTP + order notifications                  |
| **Pathao Courier** | Home delivery dispatch + status tracking       |
| **Backblaze B2**   | Cloud storage for all uploaded customer photos |
| **SMTP (Mail)**    | Email order notifications                      |

---

## 15. Technical Infrastructure

| Component           | Technology                   |
| ------------------- | ---------------------------- |
| Backend             | Laravel (PHP)                |
| Frontend            | Vue.js 3 + Inertia.js        |
| Database            | MySQL                        |
| File Storage        | Backblaze B2 (S3-compatible) |
| Session/Cache/Queue | Database-backed              |
| Timezone            | Asia/Dhaka                   |
| Roles & Permissions | Spatie Laravel Permission    |
| Auth                | Laravel Fortify + Sanctum    |
| Delivery            | Pathao Courier API (OAuth2)  |
| SMS                 | BulkSMS REST API             |
| OAuth               | Socialite (Google)           |

### Multi-Location Architecture

- Each studio location is a separate entity
- Staff assigned to specific locations
- Orders tagged to locations
- Studio fees, Pathao store IDs, all configured per location
- Reports filterable by location
- Delivery orders can be dispatched from any location with Pathao configured

---

_Document generated for internal use. Covers all features as of the current system build._
