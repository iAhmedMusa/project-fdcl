# Graph Report - src/app  (2026-04-19)

## Corpus Check
- Corpus is ~11,399 words - fits in a single context window. You may not need a graph.

## Summary
- 262 nodes · 395 edges · 22 communities detected
- Extraction: 60% EXTRACTED · 40% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Album Management|Album Management]]
- [[_COMMUNITY_Auth & Middleware|Auth & Middleware]]
- [[_COMMUNITY_Order Model|Order Model]]
- [[_COMMUNITY_Session Auth|Session Auth]]
- [[_COMMUNITY_Customer Notifications|Customer Notifications]]
- [[_COMMUNITY_Dashboard & Payments|Dashboard & Payments]]
- [[_COMMUNITY_Reports|Reports]]
- [[_COMMUNITY_Customer Management|Customer Management]]
- [[_COMMUNITY_Appointments|Appointments]]
- [[_COMMUNITY_Product CRUD|Product CRUD]]
- [[_COMMUNITY_User Admin|User Admin]]
- [[_COMMUNITY_Order Cancelled Mail|Order Cancelled Mail]]
- [[_COMMUNITY_Order Processing Mail|Order Processing Mail]]
- [[_COMMUNITY_Order Delivered Mail|Order Delivered Mail]]
- [[_COMMUNITY_Order Ready Mail|Order Ready Mail]]
- [[_COMMUNITY_Service Provider|Service Provider]]
- [[_COMMUNITY_Store Order Request|Store Order Request]]
- [[_COMMUNITY_Product Model|Product Model]]
- [[_COMMUNITY_Order Status Event|Order Status Event]]
- [[_COMMUNITY_Status Update Listener|Status Update Listener]]
- [[_COMMUNITY_Order Confirmation Listener|Order Confirmation Listener]]
- [[_COMMUNITY_Base Controller|Base Controller]]

## God Nodes (most connected - your core abstractions)
1. `Location` - 22 edges
2. `PhotoRegistry` - 19 edges
3. `OrderItem` - 12 edges
4. `OrderController` - 12 edges
5. `ReportController` - 11 edges
6. `Order` - 10 edges
7. `Appointment` - 8 edges
8. `User` - 8 edges
9. `ProductController` - 8 edges
10. `WalkInOrderController` - 8 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Album Management"
Cohesion: 0.08
Nodes (8): AlbumController, FrameController, Location, MugController, OrderItem, OrderNumberGenerator, OrderPlaced, ReprintController

### Community 1 - "Auth & Middleware"
Cohesion: 0.06
Nodes (11): EmailVerificationNotificationController, EmailVerificationPromptController, EnsureAdmin, EnsureCustomer, EnsureStaff, HandleInertiaRequests, InvoiceController, ProfileController (+3 more)

### Community 2 - "Order Model"
Cohesion: 0.08
Nodes (4): Order, OrderController, PhotoStorage, WalkInOrderController

### Community 3 - "Session Auth"
Cohesion: 0.12
Nodes (3): AuthenticatedSessionController, LoginRequest, User

### Community 4 - "Customer Notifications"
Cohesion: 0.12
Nodes (4): OrderConfirmed, PhotoRegistry, PhotoStorageController, SyncPhotoRegistry

### Community 5 - "Dashboard & Payments"
Cohesion: 0.16
Nodes (3): DashboardController, Payment, PaymentController

### Community 6 - "Reports"
Cohesion: 0.32
Nodes (1): ReportController

### Community 7 - "Customer Management"
Cohesion: 0.21
Nodes (2): CustomerController, SocialAuthController

### Community 8 - "Appointments"
Cohesion: 0.2
Nodes (2): Appointment, AppointmentController

### Community 9 - "Product CRUD"
Cohesion: 0.22
Nodes (1): ProductController

### Community 10 - "User Admin"
Cohesion: 0.33
Nodes (1): UserController

### Community 11 - "Order Cancelled Mail"
Cohesion: 0.4
Nodes (1): OrderCancelled

### Community 12 - "Order Processing Mail"
Cohesion: 0.4
Nodes (1): OrderProcessing

### Community 13 - "Order Delivered Mail"
Cohesion: 0.4
Nodes (1): OrderDelivered

### Community 14 - "Order Ready Mail"
Cohesion: 0.4
Nodes (1): OrderReady

### Community 15 - "Service Provider"
Cohesion: 0.5
Nodes (1): AppServiceProvider

### Community 16 - "Store Order Request"
Cohesion: 0.5
Nodes (1): StoreOrderRequest

### Community 17 - "Product Model"
Cohesion: 0.67
Nodes (1): Product

### Community 18 - "Order Status Event"
Cohesion: 0.67
Nodes (1): OrderStatusChanged

### Community 19 - "Status Update Listener"
Cohesion: 0.67
Nodes (1): SendStatusUpdateEmail

### Community 20 - "Order Confirmation Listener"
Cohesion: 0.67
Nodes (1): SendOrderConfirmationEmail

### Community 21 - "Base Controller"
Cohesion: 1.0
Nodes (1): Controller

## Knowledge Gaps
- **1 isolated node(s):** `Controller`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Base Controller`** (2 nodes): `Controller`, `Controller.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PhotoRegistry` connect `Customer Notifications` to `Album Management`, `Auth & Middleware`, `Order Model`, `Dashboard & Payments`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `Location` connect `Album Management` to `Order Model`, `Dashboard & Payments`, `Reports`, `Appointments`, `User Admin`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Order` connect `Order Model` to `Dashboard & Payments`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 19 inferred relationships involving `Location` (e.g. with `.index()` and `.create()`) actually correct?**
  _`Location` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `PhotoRegistry` (e.g. with `.__construct()` and `.lookup()`) actually correct?**
  _`PhotoRegistry` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `OrderItem` (e.g. with `.store()` and `.store()`) actually correct?**
  _`OrderItem` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Controller` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._