# Graph Report - src/app  (2026-04-23)

## Corpus Check
- Corpus ~13,107 words - fits single context window. Graph may not be needed.

## Summary
- 302 nodes · 478 edges · 21 communities detected
- Extraction: 59% EXTRACTED · 41% INFERRED · 0% AMBIGUOUS · INFERRED: 196 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Album & Product Pages|Album & Product Pages]]
- [[_COMMUNITY_Auth & Middleware|Auth & Middleware]]
- [[_COMMUNITY_Order Management|Order Management]]
- [[_COMMUNITY_Login & User Auth|Login & User Auth]]
- [[_COMMUNITY_Social Auth & Customer Admin|Social Auth & Customer Admin]]
- [[_COMMUNITY_Admin Dashboard & Payments|Admin Dashboard & Payments]]
- [[_COMMUNITY_Photo Storage & Mails|Photo Storage & Mails]]
- [[_COMMUNITY_Registration & SMS|Registration & SMS]]
- [[_COMMUNITY_OTP & Invoices|OTP & Invoices]]
- [[_COMMUNITY_Appointments|Appointments]]
- [[_COMMUNITY_Reports|Reports]]
- [[_COMMUNITY_Product CRUD|Product CRUD]]
- [[_COMMUNITY_Order Cancelled Mail|Order Cancelled Mail]]
- [[_COMMUNITY_Order Processing Mail|Order Processing Mail]]
- [[_COMMUNITY_Order Delivered Mail|Order Delivered Mail]]
- [[_COMMUNITY_Order Ready Mail|Order Ready Mail]]
- [[_COMMUNITY_App Service Provider|App Service Provider]]
- [[_COMMUNITY_Store Order Request|Store Order Request]]
- [[_COMMUNITY_Product Model|Product Model]]
- [[_COMMUNITY_Order Status Event|Order Status Event]]
- [[_COMMUNITY_Base Controller|Base Controller]]

## God Nodes (most connected - your core abstractions)
1. `Location` - 22 edges
2. `PhotoRegistry` - 19 edges
3. `OrderItem` - 12 edges
4. `OrderController` - 12 edges
5. `Otp` - 11 edges
6. `ReportController` - 11 edges
7. `Order` - 10 edges
8. `User` - 10 edges
9. `Appointment` - 8 edges
10. `ProductController` - 8 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections within same source files.

## Communities

### Community 0 - "Album & Product Pages"
Cohesion: 0.07
Nodes (9): AlbumController, FrameController, Location, MugController, OrderItem, OrderNumberGenerator, OrderPlaced, ReprintController (+1 more)

### Community 1 - "Auth & Middleware"
Cohesion: 0.07
Nodes (9): EmailVerificationNotificationController, EmailVerificationPromptController, EnsureAdmin, EnsureCustomer, EnsureStaff, HandleInertiaRequests, ProfileController, ProfileUpdateRequest (+1 more)

### Community 2 - "Order Management"
Cohesion: 0.11
Nodes (3): Order, OrderController, PhotoStorage

### Community 3 - "Login & User Auth"
Cohesion: 0.11
Nodes (3): AuthenticatedSessionController, LoginRequest, User

### Community 4 - "Social Auth & Customer Admin"
Cohesion: 0.13
Nodes (4): CustomerController, InvoiceService, SendInvoiceSmsOnOrderPlaced, SocialAuthController

### Community 5 - "Admin Dashboard & Payments"
Cohesion: 0.11
Nodes (4): DashboardController, Payment, PaymentController, UserController

### Community 6 - "Photo Storage & Mails"
Cohesion: 0.12
Nodes (4): OrderConfirmed, PhotoRegistry, PhotoStorageController, SyncPhotoRegistry

### Community 7 - "Registration & SMS"
Cohesion: 0.13
Nodes (4): RegisteredUserController, SendOrderConfirmationEmail, SendStatusUpdateEmail, SmsService

### Community 8 - "OTP & Invoices"
Cohesion: 0.18
Nodes (3): InvoiceController, Otp, OtpController

### Community 9 - "Appointments"
Cohesion: 0.18
Nodes (2): Appointment, AppointmentController

### Community 10 - "Reports"
Cohesion: 0.35
Nodes (1): ReportController

### Community 11 - "Product CRUD"
Cohesion: 0.22
Nodes (1): ProductController

### Community 12 - "Order Cancelled Mail"
Cohesion: 0.4
Nodes (1): OrderCancelled

### Community 13 - "Order Processing Mail"
Cohesion: 0.4
Nodes (1): OrderProcessing

### Community 14 - "Order Delivered Mail"
Cohesion: 0.4
Nodes (1): OrderDelivered

### Community 15 - "Order Ready Mail"
Cohesion: 0.4
Nodes (1): OrderReady

### Community 16 - "App Service Provider"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 17 - "Store Order Request"
Cohesion: 0.5
Nodes (1): StoreOrderRequest

### Community 18 - "Product Model"
Cohesion: 0.67
Nodes (1): Product

### Community 19 - "Order Status Event"
Cohesion: 0.67
Nodes (1): OrderStatusChanged

### Community 20 - "Base Controller"
Cohesion: 1.0
Nodes (1): Controller

## Knowledge Gaps
- **1 isolated node(s):** `Controller`
  ≤1 connection — possible missing edges or undocumented components.
- **Thin community `Base Controller`** (2 nodes): `Controller.php`, `Controller`
  Too small for meaningful cluster — noise or needs more connections extracted.

## Suggested Questions
_Questions this graph uniquely positioned to answer:_

- **Why does `PhotoRegistry` connect `Photo Storage & Mails` to `Album & Product Pages`, `Auth & Middleware`, `Order Management`, `Admin Dashboard & Payments`?**
  _High betweenness centrality (0.121) - cross-community bridge._
- **Why does `Location` connect `Album & Product Pages` to `Appointments`, `Reports`, `Order Management`, `Admin Dashboard & Payments`?**
  _High betweenness centrality (0.072) - cross-community bridge._
- **Why does `User` connect `Login & User Auth` to `Album & Product Pages`?**
  _High betweenness centrality (0.042) - cross-community bridge._
- **Are the 19 inferred relationships involving `Location` (e.g. with `.index()` and `.create()`) actually correct?**
  _`Location` has 19 INFERRED edges - needs verification._
- **Are the 15 inferred relationships involving `PhotoRegistry` (e.g. with `.__construct()` and `.lookup()`) actually correct?**
  _`PhotoRegistry` has 15 INFERRED edges - needs verification._
- **Are the 8 inferred relationships involving `OrderItem` (e.g. with `.store()` and `.store()`) actually correct?**
  _`OrderItem` has 8 INFERRED edges - needs verification._
- **Are the 6 inferred relationships involving `Otp` (e.g. with `.sendPhoneOtp()` and `.verifyPhoneOtp()`) actually correct?**
  _`Otp` has 6 INFERRED edges - needs verification._