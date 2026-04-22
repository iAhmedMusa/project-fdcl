# Invoice SMS Shortlink Feature

**Branch:** `invoice-gen`  
**Date:** 2026-04-22

---

## Overview

Every order (customer-placed and staff walk-in) automatically generates a time-limited public invoice link and sends it to the customer's phone via SMS. The link opens a browser-friendly invoice page with a PDF download button — no login required. The invoice is also accessible from the staff order detail page and the customer order detail page for authenticated users.

---

## Functional Requirements

| Requirement | Detail |
|---|---|
| Auto-send SMS | On every `OrderPlaced` event — queued, non-blocking |
| Walk-in orders | Must also dispatch `OrderPlaced`; customer phone is always present (required field) |
| Public link | No auth; token-based; expires in 30 days |
| Public invoice view | Browser HTML page + "Download PDF" button |
| Staff: existing PDF button | Unchanged — still requires auth |
| Staff: resend button | "Send Invoice SMS" button on order detail — re-sends / resets expiry |
| Staff: ready notification | Separate "Notify Ready" button — sends order-ready SMS that includes the invoice link |
| Skip on missing phone | If phone absent (shouldn't happen but defensive) — skip, log, never throw |
| No photo backdoor | Public invoice view must NOT expose photo paths, photo registry codes, or B2 URLs |

---

## Security Design

The public route exposes only billing data. The `showPublic` controller method:
- Loads only: `order.items.product`, `order.user` (name, phone only), `order.location`, `order.payments`
- Does NOT load: `photoRegistries`, `photo_paths`, any storage URLs
- The public Blade view has no photo-related sections at all
- Token is 64-char random string — not guessable
- Token expires in 30 days — after expiry, returns 410 Gone
- Route is completely separate from any photo storage routes

---

## Queue Setup

### Current state
- `QUEUE_CONNECTION=database` — set in `.env` ✓
- `jobs` / `failed_jobs` / `job_batches` tables — already migrated ✓
- Existing email listeners already implement `ShouldQueue` ✓
- **Missing:** no queue worker process running on the VPS

### Why this matters
Without a running worker, all queued jobs (email + SMS) are written to the `jobs` DB table and never executed. This applies to existing email notifications too.

### Fix — Option B (recommended first step): Separate Coolify Worker Service

In Coolify, add a second service for the same application:

1. Go to your app in Coolify → **Add Service** (or duplicate existing)
2. Use the same Git repo and branch
3. Override the **start command** to:
   ```
   php artisan queue:work --queue=default --sleep=3 --tries=3 --max-time=3600
   ```
4. Set the same environment variables (same `.env`)
5. Do NOT expose any ports — this is a worker, not a web server
6. Deploy

This worker polls the `jobs` table every 3 seconds, processes jobs, retries up to 3 times on failure.

### Fix — Option A (longer term): Supervisor in Dockerfile

Add to the project root:

**`Dockerfile`** (simplified example):
```dockerfile
FROM php:8.3-fpm

# ... install extensions, composer, etc.

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

**`supervisord.conf`**:
```ini
[supervisord]
nodaemon=true

[program:php-fpm]
command=php-fpm
autostart=true
autorestart=true

[program:laravel-worker]
command=php /var/www/html/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/worker.log
```

---

## Database

### New table: `invoice_tokens`

```php
// Migration: xxxx_create_invoice_tokens_table.php
Schema::create('invoice_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->cascadeOnDelete();
    $table->string('token', 64)->unique();
    $table->timestamp('expires_at');
    $table->timestamps();
});
```

---

## Files to Create

### 1. `database/migrations/xxxx_create_invoice_tokens_table.php`
Standard migration for `invoice_tokens` table (above).

### 2. `app/Models/InvoiceToken.php`
```php
class InvoiceToken extends Model
{
    protected $fillable = ['order_id', 'token', 'expires_at'];
    protected $casts = ['expires_at' => 'datetime'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
```

### 3. `app/Services/InvoiceService.php`

Responsibilities:
- `createOrRenewToken(Order): InvoiceToken` — creates new or resets existing token expiry to `now()->addDays(30)`
- `getPublicUrl(InvoiceToken): string` — returns `url("/i/{$token->token}")`

### 4. `app/Listeners/SendInvoiceSmsOnOrderPlaced.php`

```php
class SendInvoiceSmsOnOrderPlaced implements ShouldQueue
{
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order->loadMissing('user');
        $phone = $order->user->phone ?? null;

        if (! $phone) {
            Log::info('Invoice SMS skipped — no phone', ['order' => $order->order_number]);
            return;
        }

        try {
            $token = app(InvoiceService::class)->createOrRenewToken($order);
            $url   = app(InvoiceService::class)->getPublicUrl($token);
            app(SmsService::class)->sendInvoiceLink($phone, $url, $order->order_number);
        } catch (\Throwable $e) {
            Log::error('Invoice SMS failed', ['order' => $order->order_number, 'error' => $e->getMessage()]);
            // Do not rethrow — must not block order flow
        }
    }
}
```

### 5. `resources/views/invoice/public.blade.php`

Browser-friendly HTML page (no auth required). Contains:
- Same visual design as `pdf/invoice.blade.php`
- "Download PDF" button → links to `/i/{token}/pdf`
- Order info, items table, payment summary
- **No photo paths, no registry codes, no storage URLs**

---

## Files to Modify

### 1. `app/Http/Controllers/InvoiceController.php`

Add two new public methods (no auth middleware):

```php
// GET /i/{token}
public function showPublic(string $token): Response
{
    $invoiceToken = InvoiceToken::where('token', $token)->firstOrFail();

    if ($invoiceToken->isExpired()) {
        abort(410, 'This invoice link has expired.');
    }

    $order = $invoiceToken->order->load(['items.product', 'user', 'location', 'payments']);
    // Note: intentionally NOT loading photoRegistries

    return response()->view('invoice.public', compact('order', 'token'));
}

// GET /i/{token}/pdf
public function downloadPublic(string $token): Response
{
    $invoiceToken = InvoiceToken::where('token', $token)->firstOrFail();

    if ($invoiceToken->isExpired()) {
        abort(410, 'This invoice link has expired.');
    }

    $order = $invoiceToken->order->load(['items.product', 'user', 'location', 'payments']);
    $pdf = Pdf::loadView('pdf.invoice', compact('order'));

    return $pdf->download("FDCL-Invoice-{$order->order_number}.pdf");
}
```

### 2. `app/Services/SmsService.php`

Add:
```php
public function sendInvoiceLink(string $phone, string $url, string $orderNumber): bool
{
    $message = "FDCL Invoice for Order {$orderNumber}: {$url} (valid 30 days)";
    return $this->send($phone, $message);
}

public function sendOrderReady(string $phone, string $url, string $orderNumber): bool
{
    $message = "Your FDCL order {$orderNumber} is ready for pickup! View invoice: {$url}";
    return $this->send($phone, $message);
}
```

### 3. `routes/web.php`

```php
// Public invoice routes — no auth
Route::get('/i/{token}', [InvoiceController::class, 'showPublic'])->name('invoice.public');
Route::get('/i/{token}/pdf', [InvoiceController::class, 'downloadPublic'])->name('invoice.public.pdf');

// Staff resend (auth + staff role)
Route::post('/staff/orders/{order}/send-invoice-sms', [StaffOrderController::class, 'sendInvoiceSms'])
    ->name('staff.orders.invoice-sms');

// Staff order-ready SMS (auth + staff role)  
Route::post('/staff/orders/{order}/send-ready-sms', [StaffOrderController::class, 'sendReadySms'])
    ->name('staff.orders.ready-sms');
```

### 4. `app/Providers/AppServiceProvider.php`

```php
Event::listen(
    OrderPlaced::class,
    SendInvoiceSmsOnOrderPlaced::class
);
```

### 5. `app/Http/Controllers/Staff/WalkInOrderController.php`

In `store()`, after the DB transaction, add:
```php
OrderPlaced::dispatch($order->load(['user', 'location', 'items.product']));
```

### 6. `app/Http/Controllers/Staff/OrderController.php`

Add two actions:

**`sendInvoiceSms`** — creates/renews token, sends SMS, returns JSON  
**`sendReadySms`** — same but uses ready-pickup message; also passes `invoiceToken` and `publicUrl` as Inertia props in `show()` so the frontend has the URL

### 7. `resources/js/Pages/Staff/OrderDetail.jsx`

Add two buttons in the order actions area:
- **"Send Invoice SMS"** — `POST` to `staff.orders.invoice-sms`, shows spinner, toast on success/fail
- **"Send Ready SMS"** — `POST` to `staff.orders.ready-sms`, same UX

### 8. `resources/js/Pages/Customer/OrderDetail.jsx`

Already has `route('orders.invoice', order.id)` for PDF. Add:
- **"View Invoice Online"** link → `route('invoice.public', token)` (token passed as Inertia prop from customer order controller)

---

## Implementation Order

```
1. Migration + InvoiceToken model
2. InvoiceService (token creation + URL builder)
3. SmsService additions (sendInvoiceLink, sendOrderReady)
4. SendInvoiceSmsOnOrderPlaced listener
5. Register listener in AppServiceProvider
6. Dispatch OrderPlaced in WalkInOrderController::store()
7. InvoiceController — showPublic + downloadPublic
8. Public Blade view (invoice/public.blade.php)
9. Routes (public + staff)
10. Staff OrderController — sendInvoiceSms + sendReadySms actions
11. Staff OrderDetail.jsx — two SMS buttons
12. Customer OrderDetail.jsx — public view link
13. Queue worker setup on Coolify
```

---

## Testing Checklist

- [ ] New customer order → SMS received with working link
- [ ] Walk-in order → SMS received with working link
- [ ] Walk-in order with existing customer → SMS to their phone
- [ ] Link opens browser invoice, no photo data visible in HTML source
- [ ] PDF download button works from public link
- [ ] Expired token (manually set `expires_at` to past) → 410 response
- [ ] Missing phone → order succeeds, SMS skipped, log entry written
- [ ] Staff "Send Invoice SMS" button → toast success, SMS received
- [ ] Staff "Send Ready SMS" button → different message, link included
- [ ] Customer order detail → "View Invoice Online" link works
- [ ] Queue worker processes jobs (check `jobs` table empties after dispatch)
- [ ] Failed jobs appear in `failed_jobs` table on SMS error
