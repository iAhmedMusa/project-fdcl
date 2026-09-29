<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Invoice link expired — Focus Digital Color Lab</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #F0FDF4; color: #0F172A; line-height: 1.6; -webkit-font-smoothing: antialiased; }
        .page { max-width: 560px; margin: 0 auto; padding: 48px 16px; text-align: center; }
        .card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
        h1 { font-size: 22px; margin-bottom: 12px; }
        p { color: #475569; margin-bottom: 12px; font-size: 15px; }
        .order { display: inline-block; background: #ECFDF5; color: #065F46; font-weight: 700; border-radius: 6px; padding: 2px 10px; margin: 4px 0 12px; }
        .btn { display: inline-block; margin-top: 12px; background: #059669; color: #fff; text-decoration: none; font-weight: 600; border-radius: 8px; padding: 10px 20px; }
        .btn:hover { background: #047857; }
        .muted { font-size: 13px; color: #64748B; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="card">
            <h1>This invoice link has expired</h1>
            @if(!empty($orderNumber))
                <div class="order">Order {{ $orderNumber }}</div>
            @endif
            <p>
                Invoice links sent by SMS only work for 30 days for security.
                @if(!empty($expiresAt))
                    This link expired on {{ $expiresAt->format('M d, Y') }}.
                @endif
                Your order and invoice still exist — only this old link stopped working.
            </p>
            <p>
                Please log in to your account and open the order to get a fresh invoice,
                or ask our studio staff to send you a new invoice SMS.
            </p>
            <a class="btn" href="{{ url('/login') }}">Log in to view my invoice</a>
            <p class="muted">Focus Digital Color Lab — if you need help, contact the studio where you placed the order.</p>
        </div>
    </div>
</body>
</html>
