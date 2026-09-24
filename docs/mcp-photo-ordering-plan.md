# MCP Photo-Ordering Server — Implementation Plan

## Context

FDCL is a Laravel 11 + Inertia/React photo-lab order system. Today a customer reprints a photo by
logging into the website, entering their **FDCL photo code** (`PhotoRegistry.registry_code`, e.g.
`FDCL-7K2M9P`), choosing a product/quantity/pickup, paying via bKash out-of-band and pasting the
transaction reference.

The goal is to let a customer do that entire flow from an AI chat client through an MCP connector —
authenticating **in-conversation**: OTP over SMS for new customers, phone + password for existing
ones — mirroring the trust model of the existing web registration.

Decisions already made:

- New customers sign up with **name + phone + OTP only, no password** (`users.password` is already
  nullable for walk-ins; they set a password later via the existing forgot-password OTP flow).
- Customers **without** a photo code get a **short-lived signed upload URL** to open in a browser.
- v1 covers **photo reprint only** (album/frame/mug reuse the same service layer later).
- The `/mcp` endpoint is **public**; all customer data sits behind tool-level session tokens.

---

## Approach

Build the MCP server **inside the Laravel app** using the official `laravel/mcp` package, served as
streamable HTTP at `POST /mcp`. This shares the existing models, services and database directly, and
deploys with the app on cPanel (no second Node process to supervise).

Auth is **in-band**: auth tools issue a short-lived opaque `session_token` that the assistant passes
on every subsequent tool call. No OAuth in v1.

### Prerequisite: package install

`laravel/mcp` requires `illuminate/* ^11.45.3` and pulls `illuminate/json-schema`, whose lowest
Laravel-11-compatible release needs `illuminate/contracts ^11.47`. The project pins
`laravel/framework: ^11.31`, so:

```bash
composer update laravel/framework   # lands on >= 11.47 within the existing ^11 constraint
composer require laravel/mcp
php artisan vendor:publish --tag=ai-routes   # creates routes/ai.php
```

---

## Phase 0 — Extract shared logic (no behaviour change)

The MCP tools must not duplicate order or OTP logic. Three extractions, all behaviour-preserving:

1. **`app/Services/DeliveryOptions.php`** — move the bodies of
   `app/Http/Controllers/Concerns/HandlesDelivery.php` (`deliveryFees`, `buildDeliveryAddress`,
   `deliveryFee`, `deliveryOrderFields`) into a plain service. The trait keeps its method names and
   delegates one-liners, so `ReprintController`, `AlbumController`, `FrameController` and
   `MugController` are untouched.

2. **`app/Services/Ordering/ReprintOrderService.php`** — `place(User $user, array $data): Order`,
   holding the `DB::transaction` block, registry attach/create, `saveAddressToProfile` and
   `OrderPlaced::dispatch` currently inline in `app/Http/Controllers/ReprintController.php`
   (`store()`). `ReprintController::store()` shrinks to validation → service call → redirect.
   Reuses `OrderNumberGenerator` and `PhotoStorage` as it does now.

3. **`app/Services/OtpService.php`** — the create/send/expiry/attempt-count logic is currently
   copy-pasted in four places (`Auth/OtpController`, `Auth/RegisteredUserController`,
   `Auth/ForgotPasswordOtpController`, `ProfileController::sendPhoneOtp`). Consolidate into
   `send(string $phone, string $purpose, array $payload, string $smsType): bool` and
   `verify(string $phone, string $purpose, string $code): Otp`.

   Add migration `add_purpose_to_otps_table` (nullable indexed string, backfilled from
   `payload->type`, default `registration`) and **scope every lookup by purpose**. This also fixes a
   real existing bug: all four flows do `Otp::where('phone', …)->whereNull('verified_at')->latest()`,
   so a pending password-reset OTP can be consumed by the registration verifier and vice versa.
   MCP uses `purpose = 'mcp_auth'`.

## Phase 1 — MCP session tokens

4. Migration **`create_mcp_sessions_table`**: `user_id`, `token_hash` (unique), `expires_at`,
   `last_used_at`, `revoked_at`, `ip_address`, timestamps.

5. **`app/Models/McpSession.php`** + **`app/Services/Mcp/McpSessionManager.php`**:
   - `issue(User $user, ?string $ip): string` — returns plaintext `fdcl_mcp_<48 random chars>`,
     stores only `hash('sha256', $token)`.
   - `resolve(string $token): ?User` — sliding 60-minute TTL, 12-hour absolute cap, rejects revoked
     sessions, non-customers and `is_active = false`.
   - `revoke(string $token): void`.

6. **`app/Mcp/Concerns/RequiresCustomerSession.php`** — trait for tools: reads the `session_token`
   argument, resolves it, or returns a structured MCP error instructing the assistant to
   re-authenticate.

## Phase 2 — MCP server and tools

7. **`routes/ai.php`**: `Mcp::web('/mcp', FdclServer::class)->middleware('throttle:mcp');`
   Register the `mcp` rate limiter (60 requests/minute per IP) in
   `app/Providers/AppServiceProvider.php`, and add `mcp` to the CSRF exception list in
   `bootstrap/app.php` alongside `webhooks/pathao`.

8. **`app/Mcp/Servers/FdclServer.php`** — server name plus instructions that spell out the flow and
   explicitly tell the assistant: never invent a bKash reference, always show the quoted total
   before calling the place-order tool, never echo the session token back to the customer.

9. **`app/Mcp/Tools/`** — thin wrappers over the Phase 0 services:

   | Tool | Auth | Purpose |
   |---|---|---|
   | `ListReprintProductsTool` | – | active `category = reprint` products: name, size, price, `min_quantity`, `quantity_step` |
   | `ListStudioLocationsTool` | – | active locations for studio pickup |
   | `GetDeliveryOptionsTool` | – | regular/express fees via `DeliveryOptions::fees()` |
   | `GetPaymentInstructionsTool` | – | bKash merchant number plus "send first, then give the trx id" |
   | `StartAuthenticationTool` | – | phone → normalize, report `existing`/`new`, send OTP via `OtpService` |
   | `VerifyOtpTool` | – | phone + code (+ `name` when new) → creates customer, assigns `customer` role, fires `Registered`, returns `session_token` |
   | `LoginWithPasswordTool` | – | phone + password → `session_token` (mirrors `LoginRequest::authenticate()`: normalize, `Hash::check`, `is_active`, `RateLimiter` 5-attempt throttle) |
   | `LogoutTool` | ✓ | revoke session |
   | `LookupPhotoCodeTool` | ✓ | code → photo count, created date, ownership; unowned codes are claimable exactly as on the web |
   | `ListMyPhotoCodesTool` | ✓ | the caller's `PhotoRegistry` rows |
   | `StartPhotoUploadTool` | ✓ | returns a 30-minute signed upload URL |
   | `QuoteReprintOrderTool` | ✓ | dry-run: subtotal + delivery fee + total, no writes |
   | `PlaceReprintOrderTool` | ✓ | validates, calls `ReprintOrderService::place()`, returns order number, total and public invoice URL |
   | `ListMyOrdersTool` / `GetOrderTool` | ✓ | status, payment status, totals, invoice link |

   `PlaceReprintOrderTool` validates against the same rules as the web flow, including the required
   `bkash_reference` and the chosen product's `min_quantity`.

10. Move the hard-coded bKash number `01973140768` out of
    `resources/js/Components/Order/BkashPaymentSection.jsx` into `config/services.php`
    (`bkash.merchant_number`), shared to Inertia via `HandleInertiaRequests`, so the web page and
    `GetPaymentInstructionsTool` read one source.

## Phase 3 — Signed photo upload (customers with no code)

11. `GET|POST /mcp/upload/{user}` behind Laravel's `signed` middleware
    (`URL::temporarySignedRoute(…, now()->addMinutes(30), …)`), rendering a minimal Inertia page.
    On submit: `PhotoStorage::store()` + `OrderNumberGenerator::generateRegistryCode()` +
    `PhotoRegistry::create([... 'expires_at' => now()->addYear()])` — the same shape as the upload
    branch of `ReprintController::store()`. The page displays the new `FDCL-…` code; the assistant
    picks it up by calling `ListMyPhotoCodesTool` again.

## Phase 4 — Hardening

12. OTP abuse limits: at most 3 sends per phone per hour and 10 per IP per hour, on top of the
    existing 5-minute expiry and 5-attempt cap.
13. Duplicate-order guard: reject an identical (user, product, quantity, `bkash_reference`) order
    placed within 2 minutes, so a retried tool call cannot double-charge.
14. Scope enforcement: sessions are only ever issued to users holding the `customer` role — a staff
    or admin phone number authenticating over MCP gets a refusal, not a session.
15. Log every MCP-placed order with the session id and IP.

## Phase 5 — Tests

`tests/Feature/Mcp/` — feature tests posting JSON-RPC to `/mcp` with `Http::fake()` for SMS:

- `initialize` and `tools/list` return the expected tool set
- full new-customer path: start auth → OTP → order placed, asserting `orders`, `order_items` and
  `order_photo_registry` rows and that `OrderPlaced` fired
- existing-customer path via `LoginWithPasswordTool`
- wrong OTP, expired OTP, exhausted attempts
- expired and revoked session tokens are rejected
- customer A cannot look up or order against customer B's photo code
- a staff account cannot obtain a session

Note: `tests/Feature/Auth/RegistrationTest.php` is still the stock Breeze test (posts no phone and
redirects to a `dashboard` route that no longer exists), so the suite is likely already red. Treat
that as pre-existing, not a gate for this work.

---

## Verification

```bash
docker compose exec -u focuslab app php artisan test --filter=Mcp
docker compose exec -u focuslab app php artisan route:list --path=mcp
```

End-to-end against a running container:

```bash
curl -sS -X POST http://localhost/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Then connect it as a custom connector in Claude (Settings → Connectors → Add custom connector →
`https://<host>/mcp`) and run a live order: ask for products, authenticate with a real phone, read
the SMS code back, place a reprint against a seeded `FDCL-…` code, and confirm the order appears in
the staff dashboard and the invoice SMS goes out.

---

## Risks and open questions

- **Secrets in transcripts.** A password typed into a chat is stored by the chat client — that is why
  new signups are OTP-only. Consider making OTP the default for *existing* customers too, with
  password as the fallback.
- **Session token in model context.** Mitigated by the 60-minute sliding TTL, customer-only scope
  and revocation, but it is inherently visible to the client.
- **Authless connectors.** Personal custom connectors support no-auth servers; **org-managed**
  connectors assume OAuth 2.1 with Dynamic Client Registration. If this ever needs org-wide
  deployment, Laravel Passport plus OAuth replaces Phase 1 — the tools themselves do not change.
- **Shared hosting.** Keep responses plain JSON and avoid long-lived SSE streams, which cPanel and
  PHP-FPM will time out.
- **Payment.** `bkash_reference` stays required, so an MCP order is still "pay first, then order".
  Making it optional would be a business-rule change, not a technical one.

**Estimated effort:** roughly 3–5 focused days — about 1 day on the Phase 0 extractions and the OTP
`purpose` fix, 1.5 days on the server, session layer and tools, half a day on the signed upload page,
and 1 day on tests and a live connector run.
