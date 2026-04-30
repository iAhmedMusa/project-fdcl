# Home Delivery Feature — Implementation Plan
**Branch:** `home-delivery`
**Date drafted:** 2026-04-28
**Courier:** Steadfast Courier (Bangladesh)

---

## 1. Overview

Enable real home delivery across all customer-facing order flows. Customer pays products + delivery fee upfront via bKash (no COD). Staff dispatches via Steadfast API. Steadfast webhooks auto-update order status. Customer sees tracking code on their dashboard.

**Delivery types:** Regular | Express  
**Delivery area:** Dhaka only (city field hardcoded — not shown to customer)  
**Payment:** bKash, mandatory upfront, no COD  
**Tracking:** Steadfast tracking code exposed to customer in dashboard  

---

## 2. Steadfast API Reference

**Base URL:** `https://portal.steadfast.com.bd/public/api/v1`

**Auth headers on every request:**
```
Api-Key: {STEADFAST_API_KEY}
Secret-Key: {STEADFAST_API_SECRET}
Content-Type: application/json
```

### 2.1 Create Consignment
`POST /create_order`

Payload fields:
```json
{
  "invoice":           "FDCL-ORDER-NUMBER",
  "recipient_name":    "Customer full name",
  "recipient_phone":   "017XXXXXXXX",
  "recipient_address": "Flat X, Road Y, Block Z, Postal XXXX, Dhaka",
  "cod_amount":        0,
  "note":              "Printed photo document in envelope. [delivery_instructions]",
  "item_description":  "Printed photo document",
  "item_type":         "document",   // reprint/wizard orders (photo/document in envelope)
  "weight":            0.5,          // staff-chosen for album/frame/mug — see §6
  "service_type":      1             // 1 = Regular, 2 = Express
}
```

> **Weight/category for album, frame, mug orders:** Staff selects item type and weight before dispatching (see §6). For Reprint/Wizard (printed photos only) it defaults to `item_type=document`, `weight=0.5`.

Response on success:
```json
{
  "status": 200,
  "consignment": {
    "consignment_id": "...",
    "tracking_code":  "...",
    "invoice":        "FDCL-ORDER-NUMBER"
  }
}
```

### 2.2 Track Status
Three GET endpoints (no body):
- `GET /status_by_cid/{consignment_id}`
- `GET /status_by_invoice/{invoice}`
- `GET /status_by_trackingcode/{tracking_code}`

All return `{ "status": 200, "delivery_status": "delivered" | "cancelled" | "in_review" | ... }`

### 2.3 Webhook
Steadfast POSTs to your callback URL on every status change.

Request from Steadfast:
```
POST {STEADFAST_CALLBACK_URL}
Authorization: Bearer {STEADFAST_CALLBACK_TOKEN}
Content-Type: application/json

{
  "invoice":        "FDCL-ORDER-NUMBER",
  "tracking_code":  "...",
  "delivery_status": "delivered"
}
```

FDCL validates the Bearer token, finds the order by `order_number = invoice`, maps Steadfast status → FDCL status.

**Status mapping:**
| Steadfast `delivery_status` | FDCL `status`      |
|-----------------------------|--------------------|
| `in_review`                 | `out_for_delivery` |
| `accepted`                  | `out_for_delivery` |
| `pending`                   | `out_for_delivery` |
| `delivered_partially`       | `out_for_delivery` |
| `delivered`                 | `delivered`        |
| `cancelled`                 | `cancelled`        |
| `hold`                      | `out_for_delivery` |

---

## 3. Database Changes

### Migration 1 — `add_delivery_fields_to_orders_table.php`
Add to `orders` table (all nullable):

| Column                      | Type                      | Notes                              |
|-----------------------------|---------------------------|------------------------------------|
| `delivery_type`             | enum('regular','express') | null = studio pickup               |
| `delivery_address`          | text                      | Concatenated by backend            |
| `delivery_instructions`     | text                      | For delivery man                   |
| `delivery_fee`              | decimal(8,2) default 0    | Added to total_amount at creation  |
| `steadfast_consignment_id`  | string nullable           | From Steadfast API response        |
| `steadfast_tracking_code`   | string nullable           | Shown to customer                  |
| `steadfast_delivery_status` | string nullable           | Raw Steadfast status string        |

### Migration 2 — `add_out_for_delivery_to_orders_status.php`
Modify `orders.status` enum to add `out_for_delivery`:
```
pending → processing → ready → out_for_delivery → delivered
                             ↘ (studio orders skip out_for_delivery) → delivered
```

> MySQL enum modification: use raw ALTER TABLE statement in migration.

---

## 4. Config & Environment

### `config/services.php` — add:
```php
'steadfast' => [
    'api_key'        => env('STEADFAST_API_KEY'),
    'secret_key'     => env('STEADFAST_API_SECRET'),
    'base_url'       => env('STEADFAST_BASE_URL', 'https://portal.steadfast.com.bd/public/api/v1'),
    'callback_token' => env('STEADFAST_CALLBACK_TOKEN'),   // Bearer token Steadfast sends
    'regular_fee'    => env('STEADFAST_REGULAR_FEE', 80),  // BDT — set your actual rate
    'express_fee'    => env('STEADFAST_EXPRESS_FEE', 150), // BDT — set your actual rate
],
```

### `.env.example` — add:
```
STEADFAST_API_KEY=
STEADFAST_API_SECRET=
STEADFAST_BASE_URL=https://portal.steadfast.com.bd/public/api/v1
STEADFAST_CALLBACK_TOKEN=
STEADFAST_REGULAR_FEE=80
STEADFAST_EXPRESS_FEE=150
```

---

## 5. New PHP Files

### `app/Services/SteadfastService.php`
```
Methods:
  - createConsignment(Order $order, string $itemType = 'document', float $weight = 0.5): array
  - getStatusByConsignmentId(string $id): array
  - getStatusByInvoice(string $invoice): array
  - getStatusByTrackingCode(string $code): array
  - private request(string $method, string $path, array $data = []): array
```

Notes:
- `createConsignment` reads `$order->delivery_type` to set `service_type` (1=regular, 2=express)
- `cod_amount` always 0
- note = `$order->delivery_instructions ?? ''` prepended with "Printed photo document. "
- For Wizard/Reprint: `item_type = document`, `weight = 0.5` (defaults)
- For Album/Frame/Mug: staff provides `$itemType` and `$weight` at dispatch time

### `app/Http/Controllers/Webhooks/SteadfastWebhookController.php`
```
Methods:
  - handle(Request $request): Response
    1. Validate Authorization: Bearer {STEADFAST_CALLBACK_TOKEN}
    2. Find Order by order_number = $request->invoice
    3. Update order->steadfast_delivery_status = $request->delivery_status
    4. Map to FDCL status via table in §2.3
    5. Fire OrderStatusChanged event if status changed
    6. Return 200 OK
```

---

## 6. Modified PHP Files

### `app/Models/Order.php`
- Add 7 new columns to `$fillable`
- Add helper: `isDelivery(): bool` → `$this->pickup_type === 'delivery'`

### `app/Http/Requests/StoreOrderRequest.php`
Current: `bkash_reference` required always.
New conditional rules:
```php
'pickup_type'            => 'required|in:studio,delivery',
'delivery_type'          => 'required_if:pickup_type,delivery|in:regular,express|nullable',
'delivery_address'       => 'required_if:pickup_type,delivery|nullable|string|max:500',
'delivery_instructions'  => 'nullable|string|max:500',
'location_id'            => 'required_if:pickup_type,studio|nullable|exists:locations,id',
```

### All 5 order controllers (Album, Frame, Mug, Reprint, OrderController/Wizard)

For each controller's `store()`:
1. Validate new delivery fields
2. Compute delivery fee: `pickup_type=delivery` → lookup config by `delivery_type`
3. `total_amount = product_total + delivery_fee`
4. `Order::create([..., 'pickup_type', 'delivery_type', 'delivery_address', 'delivery_instructions', 'delivery_fee'])`
5. `location_id = null` for delivery orders (assigned at dispatch time by staff)
6. `location_id = $validated['location_id']` for studio orders
7. If `pickup_type = delivery`, save concatenated address to `$user->update(['address' => $validated['delivery_address']])`

**Address concatenation** (backend):
```php
$address = implode(', ', array_filter([
    $validated['flat'],
    $validated['road'],
    $validated['block'],
    $validated['postal_code'],
    'Dhaka',
]));
```

The frontend sends 4 separate fields; backend concatenates before saving.

### `app/Http/Controllers/Staff/OrderController.php`

**`updateStatus()`** changes:
- Add `out_for_delivery` to allowed values: `'required|in:pending,processing,ready,out_for_delivery,delivered,cancelled'`
- Update valid transitions:
  ```php
  'ready' => ['out_for_delivery', 'delivered', 'cancelled'],  // out_for_delivery only for delivery orders; delivered for studio
  'out_for_delivery' => ['delivered', 'cancelled'],
  ```
- Add guard: studio orders cannot be set to `out_for_delivery`

**New `dispatch(Request $request, Order $order)`**:
```
1. Validate: order is delivery type, status is 'ready', not already dispatched
2. Validate request: item_type (string), weight (numeric, min 0.1)
3. Call SteadfastService::createConsignment($order, $itemType, $weight)
4. Save consignment_id + tracking_code to order
5. Set order->location_id = $request->user()->location_id  ← assigns studio at dispatch time
6. Set order->status = 'out_for_delivery'
7. Fire OrderStatusChanged event
8. Redirect back with success
```

**`show()`** — add to response:
```php
'pickup_type'                => $order->pickup_type,
'delivery_type'              => $order->delivery_type,
'delivery_address'           => $order->delivery_address,
'delivery_instructions'      => $order->delivery_instructions,
'delivery_fee'               => (float) $order->delivery_fee,
'steadfast_consignment_id'   => $order->steadfast_consignment_id,
'steadfast_tracking_code'    => $order->steadfast_tracking_code,
'steadfast_delivery_status'  => $order->steadfast_delivery_status,
```

### `routes/web.php`
```php
// Webhook — CSRF exempt (add to VerifyCsrfToken $except or use api.php)
Route::post('/webhooks/steadfast', [SteadfastWebhookController::class, 'handle'])
    ->name('webhooks.steadfast');

// Staff dispatch action
Route::post('/staff/orders/{order}/dispatch', [Staff\OrderController::class, 'dispatch'])
    ->middleware(['auth', 'staff'])
    ->name('staff.orders.dispatch');
```

> Add `/webhooks/steadfast` to `VerifyCsrfToken::$except[]` (or move to `routes/api.php`).

---

## 7. New React Component

### `resources/js/Components/Order/DeliverySection.jsx`

**Props:**
```js
{
  pickupType,        // 'studio' | 'delivery'
  setPickupType,
  deliveryType,      // 'regular' | 'express'
  setDeliveryType,
  flat, setFlat,
  road, setRoad,
  block, setBlock,
  postalCode, setPostalCode,
  deliveryInstructions, setDeliveryInstructions,
  locationId, setLocationId,   // only used when pickupType === 'studio'
  locations,         // array — only shown for studio pickup
  regularFee,        // number (from page props)
  expressFee,        // number (from page props)
  errors,
  userAddress,       // string | null — pre-fill hint only
}
```

**UI structure:**

```
[ Studio Pickup ]  [ Home Delivery — Steadfast Courier ]   ← toggle buttons

IF studio:
  Location dropdown — "Pickup Studio" label
  (Bailey Road or Gulshan — where customer collects)

IF delivery:
  ┌─ Delivery Type ──────────────────────────────────┐
  │  ○ Regular  ৳80  (2–3 days)                      │
  │  ● Express  ৳150 (next day)                      │
  └──────────────────────────────────────────────────┘

  ┌─ Delivery Address ───────────────────────────────┐
  │  Flat / Apt No.    [__________]                  │
  │  Road / Street     [__________]                  │
  │  Block / Avenue    [__________]                  │
  │  Postal Code       [__________]                  │
  │  City              Dhaka  (static text)          │
  └──────────────────────────────────────────────────┘
  ℹ️  Address will be saved to your profile.

  ┌─ Note for Delivery Man (optional) ──────────────┐
  │  [textarea]                                      │
  └──────────────────────────────────────────────────┘

  NOTE: No studio selector shown for delivery.
  Staff will assign the fulfilling studio at dispatch time.
```

**Pre-fill logic:** If `userAddress` is set (from `auth.user.address`), show it as a placeholder or a "Use saved address" button that fills the fields. Since the DB stores the concatenated string, pre-fill only the full string into a note — the 4 fields start empty unless the user clicks "Use saved".

**Fee display:** DeliverySection does NOT render the total — parent page owns the total calculation. Parent computes: `total = productTotal + (pickupType === 'delivery' ? (deliveryType === 'express' ? expressFee : regularFee) : 0)`.

---

## 8. Modified Frontend Pages

### Pages to update (all share the same pattern):

| File | Note |
|------|------|
| `resources/js/Pages/Order/Wizard.jsx` | Replace "Coming soon" delivery button in Step 2 with real DeliverySection |
| `resources/js/Pages/Order/Album.jsx` | Replace location section with DeliverySection |
| `resources/js/Pages/Order/Frame.jsx` | Same |
| `resources/js/Pages/Order/Mug.jsx` | Same |
| `resources/js/Pages/Order/PhotoReprint.jsx` | Replace disabled Home delivery radio with DeliverySection |
| `resources/js/Pages/Landing/Album.jsx` | Show DeliverySection only when `auth.user` — same as bKash section pattern |
| `resources/js/Pages/Landing/Frame.jsx` | Same |
| `resources/js/Pages/Landing/Mug.jsx` | Same |

**State to add per page:**
```js
const [pickupType, setPickupType] = useState('studio');
const [deliveryType, setDeliveryType] = useState('regular');
const [flat, setFlat] = useState('');
const [road, setRoad] = useState('');
const [block, setBlock] = useState('');
const [postalCode, setPostalCode] = useState('');
const [deliveryInstructions, setDeliveryInstructions] = useState('');
```

**localStorage keys** (for Landing pages — persist across login redirect):
```js
const STORAGE_KEY = 'pending_album_order'; // each page has its own
// add to saved/restored fields: pickupType, deliveryType, flat, road, block, postalCode, deliveryInstructions
```

**`canSubmit` update:**
```js
const deliveryAddressComplete = flat.trim() && road.trim() && postalCode.trim();
const canSubmit = selectedProduct && quantity > 0
  && (pickupType === 'studio' ? selectedLocation : deliveryAddressComplete && deliveryType)
  && bkashRef.trim();
// Note: no selectedLocation check for delivery — staff assigns studio at dispatch
```

**router.post payload additions:**
```js
pickup_type: pickupType,
delivery_type: pickupType === 'delivery' ? deliveryType : null,
flat: pickupType === 'delivery' ? flat : null,
road: pickupType === 'delivery' ? road : null,
block: pickupType === 'delivery' ? block : null,
postal_code: pickupType === 'delivery' ? postalCode : null,
delivery_instructions: pickupType === 'delivery' ? deliveryInstructions : null,
location_id: pickupType === 'studio' ? parseInt(selectedLocation) : null,
// delivery orders send location_id: null — assigned by staff at dispatch
```

**Props from controllers** (pass delivery fees to all order pages):
```php
'deliveryFees' => [
    'regular' => config('services.steadfast.regular_fee'),
    'express' => config('services.steadfast.express_fee'),
],
```

**Wizard specific:** DeliverySection goes into Step 2 (location step). When `pickupType = delivery`, the location dropdown is hidden and the delivery fee is added to the total shown in Step 4 review.

---

## 9. Staff Panel Changes

### `resources/js/Pages/Staff/OrderDetail.jsx`

**Delivery info block** (when `order.pickup_type === 'delivery'`):
- Show: delivery type badge (Regular / Express), delivery address, delivery instructions, delivery fee
- Show: Steadfast consignment ID and tracking code (once dispatched)
- Show: current `steadfast_delivery_status` raw string
- Show: **Dispatch button** — only when `status === 'ready'` and `!order.steadfast_consignment_id`

**Dispatch modal/form:**
```
For Reprint/Wizard orders:    item_type = "document" (pre-set, not editable)
                              weight = 0.5 kg (pre-set, editable)
For Album/Frame/Mug orders:   item_type = dropdown: document | parcel | other
                              weight = number input (kg)
```

**Status timeline** — add `out_for_delivery` step between `ready` and `delivered` for delivery orders.

### `resources/js/Pages/Staff/Orders.jsx` (list view)
- Add delivery indicator (small truck icon) on delivery orders in the list
- Delivery orders with `location_id = null` (unassigned) **bypass the location filter** — visible to all staff regardless of their studio. Studio pickup orders remain filtered to matching `location_id` only.

---

## 10. Customer Dashboard Changes

### `resources/js/Pages/Customer/OrderDetail.jsx`

**Delivery Method section** — currently shows "Coming Soon" badge. Replace with:
- Steadfast tracking code (copy button)
- Delivery type (Regular / Express)
- Delivery address
- Raw `steadfast_delivery_status` label
- Link: `https://steadfast.com.bd/track/{tracking_code}` → opens Steadfast's own tracking page (if they have one)

**STATUS_TIMELINE** update for delivery orders:
```js
// For delivery orders
const STATUS_TIMELINE_DELIVERY = ['pending', 'processing', 'ready', 'out_for_delivery', 'delivered'];
// For studio orders (unchanged)
const STATUS_TIMELINE_STUDIO = ['pending', 'processing', 'ready', 'delivered'];
```

**STATUS_LABELS** add:
```js
out_for_delivery: 'Out for Delivery'
```

**STATUS_COLORS** add:
```js
out_for_delivery: 'bg-blue-50 text-blue-700'
```

### `resources/js/Pages/Customer/Dashboard.jsx` (order list)
- When `pickup_type === 'delivery'`, show delivery address snippet instead of location name
- Show tracking code if available

---

## 11. Customer Dashboard Controller

Find the controller that renders `Customer/OrderDetail` and add these fields to the order response:
```php
'pickup_type'               => $order->pickup_type,
'delivery_type'             => $order->delivery_type,
'delivery_address'          => $order->delivery_address,
'delivery_fee'              => (float) $order->delivery_fee,
'steadfast_tracking_code'   => $order->steadfast_tracking_code,
'steadfast_delivery_status' => $order->steadfast_delivery_status,
```

---

## 12. Build Sequence (recommended order)

```
1.  Migrations (run: php artisan migrate)
2.  Order model + SteadfastService
3.  config/services.php + .env.example
4.  SteadfastWebhookController + route (CSRF exempt)
5.  StoreOrderRequest validation update
6.  All 5 order controllers (store methods)
7.  Staff OrderController (dispatch + updateStatus)
8.  Staff route (dispatch)
9.  DeliverySection.jsx component
10. Order/* pages (5 files)
11. Landing/* pages (3 files)
12. Staff/OrderDetail.jsx (dispatch modal + delivery info)
13. Customer/OrderDetail.jsx (tracking + delivery timeline)
14. Customer/Dashboard.jsx (list view tweaks)
```

---

## 13. Two-Location Routing

### Studio pickup orders
Customer picks Bailey Road or Gulshan at order time. `location_id` set immediately. Staff see only orders matching their studio — unchanged from current behaviour.

### Delivery orders — queue visibility
`location_id = null` when order is created. The staff `Orders` list query must be updated:

```php
// Current filter (location-restricted):
if ($user->location_id) {
    $query->where('location_id', $user->location_id);
}

// New filter — delivery orders with null location bypass the restriction:
if ($user->location_id) {
    $query->where(function ($q) use ($user) {
        $q->where('location_id', $user->location_id)
          ->orWhere(function ($q2) {
              $q2->where('pickup_type', 'delivery')
                 ->whereNull('location_id');
          });
    });
}
```

All staff at both studios see unassigned delivery orders in their queue.

### Dispatch assigns the studio
When any staff member clicks Dispatch on a delivery order:
```php
$order->location_id = $request->user()->location_id;  // Bailey Road or Gulshan
```
After dispatch, the order is "owned" by that studio. It will no longer appear in the other studio's unassigned pool.

### Summary table

| Order type | `location_id` at creation | `location_id` after dispatch | Who sees it in queue |
|---|---|---|---|
| Studio pickup | Set by customer | Unchanged | Staff at that studio only |
| Home delivery | `null` | Set to dispatching staff's studio | All staff (until dispatched) |

### 13.1 How studio locations are populated in customer order forms

All customer-facing order controllers (Album, Frame, Mug, Reprint, OrderController/Wizard) must pass the locations list to the view. The `HandlesDelivery` trait already provides `deliveryFees()`; add a companion helper there:

```php
// app/Http/Controllers/Concerns/HandlesDelivery.php
protected function locations(): \Illuminate\Support\Collection
{
    return \App\Models\Location::where('is_active', true)
        ->orderBy('name')   // Bailey Road → Gulshan alphabetically
        ->get(['id', 'name', 'address']);
}
```

Each order controller's `create()` / `show()` merges both into the Inertia response:

```php
return Inertia::render('Order/Album', [
    'locations'    => $this->locations(),
    'deliveryFees' => $this->deliveryFees(),
    // ...existing props
]);
```

**Frontend — DeliverySection receives:**
```jsx
<DeliverySection
  locations={locations}   // [{id, name, address}, ...]  — both studios
  locationId={locationId}
  setLocationId={setLocationId}
  ...
/>
```

The dropdown renders each `location.name` as an option. With two studios the customer sees:
```
── Select studio ──
Bailey Road
Gulshan
```

No extra filtering — all active locations appear. If a third studio is added later, it appears automatically.

**Wizard (dark-theme):** Step 2 builds the location `<select>` inline from the same `locations` prop passed down to the Wizard component — no DeliverySection used there, but same data source.

---

## 14. Open Questions / Decisions Made

| # | Question | Decision |
|---|----------|----------|
| 1 | Expose tracking code to customer? | **Yes** — in customer OrderDetail |
| 2 | COD available? | **No** — bKash upfront only |
| 3 | Delivery area restriction? | Dhaka only — city hardcoded, no geo-validation |
| 4 | Item type for album/frame/mug? | Staff chooses at dispatch time (type + weight) |
| 5 | Item type for reprint/wizard? | Auto: `document`, weight `0.5` kg |
| 6 | When is Steadfast consignment created? | When staff clicks Dispatch (status = ready) |
| 7 | What if Steadfast API fails at dispatch? | Show error to staff, order stays at `ready` |
| 8 | Delivery fee in total_amount? | Yes — `total_amount = product_total + delivery_fee` |
| 9 | Save address to user profile? | Yes — concatenated string → `users.address` |
| 10 | Landing page delivery for guests? | Hidden — shown only after login (same as bKash section) |
| 11 | Customer picks fulfilling studio for delivery? | **No** — staff assigns at dispatch time |
| 12 | How do staff see unassigned delivery orders? | Delivery orders with `null location_id` bypass location filter — visible to all staff |
| 13 | Which studio gets assigned on delivery? | Whichever staff member clicks Dispatch — their `location_id` is saved to the order |

---

## 15. Files Summary

### New files
- `database/migrations/2026_04_28_000002_add_delivery_fields_to_orders_table.php`
- `database/migrations/2026_04_28_000003_add_out_for_delivery_to_orders_status.php`
- `app/Services/SteadfastService.php`
- `app/Http/Controllers/Webhooks/SteadfastWebhookController.php`
- `resources/js/Components/Order/DeliverySection.jsx`

### Modified files (16)
- `config/services.php`
- `.env.example`
- `app/Models/Order.php`
- `app/Http/Requests/StoreOrderRequest.php`
- `app/Http/Controllers/AlbumController.php`
- `app/Http/Controllers/FrameController.php`
- `app/Http/Controllers/MugController.php`
- `app/Http/Controllers/ReprintController.php`
- `app/Http/Controllers/OrderController.php`
- `app/Http/Controllers/Staff/OrderController.php`
- `routes/web.php`
- `resources/js/Pages/Order/Wizard.jsx`
- `resources/js/Pages/Order/Album.jsx`
- `resources/js/Pages/Order/Frame.jsx`
- `resources/js/Pages/Order/Mug.jsx`
- `resources/js/Pages/Order/PhotoReprint.jsx`
- `resources/js/Pages/Landing/Album.jsx`
- `resources/js/Pages/Landing/Frame.jsx`
- `resources/js/Pages/Landing/Mug.jsx`
- `resources/js/Pages/Staff/OrderDetail.jsx`
- `resources/js/Pages/Customer/OrderDetail.jsx`
- `resources/js/Pages/Customer/Dashboard.jsx`
