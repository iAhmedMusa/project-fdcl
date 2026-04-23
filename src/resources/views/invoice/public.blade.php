<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Invoice {{ $order->order_number }} — Focus Digital Color Lab</title>
    @if(!($isPdf ?? false))
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
    @endif
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --navy:      #0F172A;
            --navy-2:    #1E293B;
            --emerald:   #059669;
            --emerald-d: #047857;
            --emerald-l: #ECFDF5;
            --bg:        #F0FDF4;
            --surface:   #FFFFFF;
            --border:    #E2E8F0;
            --text:      #0F172A;
            --muted:     #64748B;
            --red:       #DC2626;
            --red-bg:    #FEF2F2;
            --paid:      #065F46;
            --paid-bg:   #D1FAE5;
        }

        body {
            font-family: 'Open Sans', system-ui, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            background: var(--bg);
            color: var(--text);
            overscroll-behavior: contain;
            -webkit-font-smoothing: antialiased;
        }

        @media (prefers-reduced-motion: reduce) {
            * { transition: none !important; animation: none !important; }
        }

        .page { max-width: 700px; margin: 0 auto; padding: 24px 16px 60px; }

        /* ── Invoice card ── */
        .card {
            background: var(--surface);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,.04), 0 8px 32px rgba(0,0,0,.10);
            position: relative;
            margin-bottom: 16px;
        }


        /* ── Card header (navy) ── */
        .card-header {
            background: var(--navy);
            padding: 24px 28px 28px;
        }
        .header-inner {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .header-logo {
            width: 100px;
            height: 100px;
            object-fit: contain;
            flex-shrink: 0;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            padding: 6px;
        }
        .header-content {
            flex: 1;
            text-align: center;
            padding-right: 80px; /* optical balance against logo width */
        }
        .studio-name {
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .emerald-rule {
            width: 40px;
            height: 3px;
            background: var(--emerald);
            border-radius: 2px;
            margin: 0 auto 12px;
        }
        .invoice-tag {
            font-size: 10px;
            font-weight: 600;
            color: var(--emerald);
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .invoice-num {
            font-family: 'Poppins', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.5px;
        }
        @media (max-width: 480px) {
            .header-content { padding-right: 0; }
            .header-logo { width: 86px; height: 86px; }
        }

        /* ── Card body ── */
        .card-body { padding: 28px 28px 24px; }

        @media (max-width: 480px) {
            .card-header, .logo-strip { padding-left: 16px; padding-right: 16px; }
            .card-body { padding: 20px 16px 18px; }
        }

        /* ── Meta grid ── */
        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 28px;
        }
        @media (max-width: 480px) {
            .meta-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        .meta-label {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--emerald);
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid var(--border);
        }
        .meta-block p         { font-size: 14px; line-height: 1.6; color: var(--text); }
        .meta-block p.muted   { color: var(--muted); font-size: 13px; }
        .meta-block strong    { font-weight: 600; }

        .status-pill {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .s-pending    { background: #F1F5F9; color: #475569; }
        .s-processing { background: #DBEAFE; color: #1E40AF; }
        .s-ready      { background: #FEF3C7; color: #92400E; }
        .s-delivered  { background: var(--paid-bg); color: var(--paid); }
        .s-cancelled  { background: var(--red-bg); color: var(--red); }

        /* ── Section divider ── */
        .section-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        .section-divider::before,
        .section-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border);
        }
        .section-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--emerald);
            flex-shrink: 0;
        }

        /* ── Items table ── */
        .table-wrap {
            overflow-x: auto;
            border-radius: 10px;
            border: 1px solid var(--border);
            margin-bottom: 24px;
        }
        table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 380px; }
        thead { background: var(--emerald); }
        th {
            padding: 10px 14px;
            text-align: left;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #fff;
        }
        th:last-child { text-align: right; }
        td { padding: 11px 14px; border-bottom: 1px solid var(--border); }
        td:last-child { text-align: right; font-weight: 600; }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:nth-child(even) { background: #F8FAFC; }

        .cat-tag {
            display: inline-block;
            font-size: 10px;
            font-weight: 600;
            color: var(--emerald);
            background: var(--emerald-l);
            padding: 1px 7px;
            border-radius: 4px;
            margin-bottom: 3px;
            letter-spacing: .3px;
            text-transform: uppercase;
        }
        .item-name { font-size: 13px; font-weight: 600; color: var(--text); display: block; }
        .item-size { font-size: 12px; color: var(--muted); }

        tfoot td {
            padding: 12px 14px;
            background: var(--navy);
            color: #fff;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 14px;
        }
        tfoot td:first-child { color: #94A3B8; font-size: 11px; letter-spacing: .5px; text-transform: uppercase; }

        /* ── Payment + Photo ID row ── */
        .payment-row-wrap {
            display: flex;
            align-items: flex-start;
            gap: 16px;
        }
        @media (max-width: 480px) { .payment-row-wrap { flex-direction: column; } }

        .photo-id-card {
            flex: 1;
            background: var(--emerald-l);
            border: 1.5px solid #6EE7B7;
            border-radius: 12px;
            padding: 18px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .photo-id-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--emerald-d);
            margin-bottom: 8px;
        }
        .photo-id-code {
            font-family: 'Poppins', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--navy);
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .photo-id-hint {
            font-size: 12px;
            color: var(--muted);
            line-height: 1.5;
        }

        /* ── Payment summary ── */
        .payment-box {
            background: #F8FAFC;
            border: 1.5px solid var(--border);
            border-radius: 12px;
            padding: 18px 20px;
            width: 300px;
            flex-shrink: 0;
        }
        @media (max-width: 480px) { .payment-box { width: 100%; } }
        .payment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            font-size: 14px;
        }
        .payment-row .p-label { color: var(--muted); }
        .payment-row .p-val   { font-weight: 600; }
        .payment-divider { height: 1px; background: var(--border); margin: 10px 0; }
        .payment-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            font-weight: 700;
        }
        .payment-total.balance { color: var(--red); }
        .payment-total.paid    { color: var(--paid); }

        /* ── Card footer / branches ── */
        .card-footer {
            background: var(--navy);
            padding: 22px 28px 18px;
        }
        @media (max-width: 480px) { .card-footer { padding: 18px 16px; } }
        .branches {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 16px;
        }
        @media (max-width: 480px) { .branches { grid-template-columns: 1fr; gap: 14px; } }
        .branch-name {
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            font-weight: 700;
            color: var(--emerald);
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 5px;
        }
        .branch-addr { font-size: 12px; color: #94A3B8; line-height: 1.7; }

        .footer-bottom {
            border-top: 1px solid #1E293B;
            padding-top: 14px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
        }
        .footer-meta     { font-size: 11px; color: #64748B; }
        .footer-meta a   { color: var(--emerald); text-decoration: none; }
        .footer-meta strong { color: #94A3B8; }

        /* ── Bottom action buttons ── */
        .action-bar {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            padding: 4px 0 8px;
        }
        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            padding: 13px 24px;
            min-height: 48px;
            border-radius: 50px;
            white-space: nowrap;
            cursor: pointer;
            border: none;
            transition: background 180ms ease, transform 120ms ease, box-shadow 180ms ease;
        }
        .btn-download {
            background: var(--emerald);
            color: #fff;
            box-shadow: 0 2px 12px rgba(5,150,105,.30);
        }
        .btn-download:hover { background: var(--emerald-d); box-shadow: 0 4px 18px rgba(5,150,105,.38); }
        .btn-share {
            background: var(--surface);
            color: var(--navy);
            border: 1.5px solid var(--border);
            box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
        .btn-share:hover { background: #F1F5F9; }
        .btn-action:focus  { outline: 3px solid var(--emerald); outline-offset: 3px; }
        .btn-action:active { transform: scale(0.97); }
        .btn-action svg    { width: 18px; height: 18px; flex-shrink: 0; }
    </style>
</head>
<body>
@php
$categoryLabels = [
    'photo_studio' => 'Photo Studio',
    'reprint'      => 'Photo Reprint',
    'album'        => 'Photo Album',
    'frame'        => 'Photo Frame',
    'mug'          => 'Custom Mug',
];
$balance    = $order->total_amount - ($order->discount_amount ?? 0) - $order->amount_paid;
$registries = $order->photoRegistries;
$pdfUrl     = isset($token) ? route('invoice.public.pdf', $token) : '#';
$shareText  = isset($token) ? urlencode("FDCL Invoice {$order->order_number}: {$pdfUrl}") : '';
@endphp

<div class="page">

    <div class="card">

        {{-- Navy header with logo left --}}
        <div class="card-header">
            <div class="header-inner">
                <img class="header-logo" src="{{ asset('images/logo.png') }}" alt="Focus Digital Color Lab">
                <div class="header-content">
                    <div class="studio-name">Focus Digital Color Lab</div>
                    <div class="emerald-rule"></div>
                    <div class="invoice-tag">Invoice</div>
                    <div class="invoice-num">{{ $order->order_number }}</div>
                </div>
            </div>
        </div>

        {{-- Body --}}
        <div class="card-body">

            <div class="meta-grid">
                <div class="meta-block">
                    <div class="meta-label">Billed To</div>
                    <p><strong>{{ $order->user->name }}</strong></p>
                    @if($order->user->phone)
                        <p class="muted">{{ $order->user->phone }}</p>
                    @endif
                </div>
                <div class="meta-block">
                    <div class="meta-label">Order Details</div>
                    <p><strong>Date:</strong> {{ $order->created_at->format('d M Y') }}</p>
                    <p><strong>Branch:</strong> {{ $order->location->name }}</p>
                    <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
                </div>
            </div>

            <div class="section-divider"><div class="section-dot"></div></div>

            {{-- Items table --}}
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th style="text-align:center">Qty</th>
                            <th style="text-align:right">Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->items->filter(fn($i) => $i->reprint_source !== 'studio_fee') as $item)
                        <tr>
                            <td>
                                <span class="cat-tag">{{ $item->reprint_source === 'awaiting' ? 'Studio Service' : ($categoryLabels[$item->product->category] ?? $item->product->category) }}</span>
                                <span class="item-name">{{ $item->product->name }}</span>
                                @if($item->product->size_label)
                                    <span class="item-size">{{ $item->product->size_label }}</span>
                                @endif
                            </td>
                            <td style="text-align:center;color:var(--muted)">{{ $item->quantity }}</td>
                            <td style="text-align:right;color:var(--muted);font-weight:400">৳{{ number_format($item->unit_price, 0) }}</td>
                            <td>৳{{ number_format($item->subtotal, 0) }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Order Total</td>
                            <td style="text-align:right;font-size:16px">৳{{ number_format($order->total_amount, 0) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {{-- Payment + Photo ID --}}
            <div class="payment-row-wrap">
                @if($registries->isNotEmpty())
                <div class="photo-id-card">
                    <div class="photo-id-label">Your FDCL Photo {{ $registries->count() > 1 ? 'IDs' : 'ID' }}</div>
                    @foreach($registries as $registry)
                        <div class="photo-id-code">{{ $registry->registry_code }}</div>
                    @endforeach
                    <div class="photo-id-hint">Save {{ $registries->count() > 1 ? 'these codes' : 'this code' }} to reorder your photos any time without re-uploading.</div>
                </div>
                @endif
                <div class="payment-box">
                    <div class="payment-row">
                        <span class="p-label">Subtotal</span>
                        <span class="p-val">৳{{ number_format($order->total_amount, 0) }}</span>
                    </div>
                    <div class="payment-row">
                        <span class="p-label">Paid</span>
                        <span class="p-val">৳{{ number_format($order->amount_paid, 0) }}</span>
                    </div>
                    <div class="payment-divider"></div>
                    @if($balance > 0)
                        <div class="payment-total balance">
                            <span>Balance Due</span>
                            <span>৳{{ number_format($balance, 0) }}</span>
                        </div>
                    @else
                        <div class="payment-total paid">
                            <span>Balance Due</span>
                            <span>৳0 (Settled)</span>
                        </div>
                    @endif
                </div>
            </div>

        </div>

        {{-- Branches footer --}}
        <div class="card-footer">
            <div class="branches">
                <div>
                    <div class="branch-name">Bailey Road</div>
                    <div class="branch-addr">
                        Shantinagar Moar, Bailey Road<br>
                        Dhaka, Bangladesh<br>
                        +880 1713-140768
                    </div>
                </div>
                <div>
                    <div class="branch-name">Gulshan</div>
                    <div class="branch-addr">
                        House 5, Road 21, Gulshan-1<br>
                        Dhaka 1212, Bangladesh<br>
                        +880 1713-140768
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <span class="footer-meta">
                    <a href="https://www.focusdigitalcolorlab.com" target="_blank" rel="noreferrer">www.focusdigitalcolorlab.com</a>
                </span>
                <span class="footer-meta"><strong>Hours:</strong> Sat–Thu 9:30 AM–9:00 PM &bull; Fri 3:00–9:00 PM</span>
                <span class="footer-meta">Trusted since 2009</span>
            </div>
        </div>

    </div>

    {{-- Action buttons — hidden in PDF render --}}
    @if(!($isPdf ?? false))
    <div class="action-bar">
        <a class="btn-action btn-download" href="{{ $pdfUrl }}">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download PDF
        </a>
        <button class="btn-action btn-share" onclick="shareInvoice()" aria-label="Share invoice">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            Share Invoice
        </button>
    </div>
    @endif

</div>

@if(!($isPdf ?? false))
<script>
async function shareInvoice() {
    const pdfUrl  = '{{ $pdfUrl }}';
    const title   = 'FDCL Invoice {{ $order->order_number }}';
    const text    = 'View your Focus Digital Color Lab invoice:';

    if (navigator.share) {
        try {
            await navigator.share({ title, text, url: pdfUrl });
        } catch (e) {
            if (e.name !== 'AbortError') whatsappFallback(pdfUrl, title);
        }
    } else {
        whatsappFallback(pdfUrl, title);
    }
}

function whatsappFallback(url, title) {
    window.open('https://wa.me/?text=' + encodeURIComponent(title + '\n' + url), '_blank');
}
</script>
@endif
</body>
</html>
