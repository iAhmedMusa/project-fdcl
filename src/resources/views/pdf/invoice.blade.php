<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #0F172A;
            background: #FFFFFF;
        }

        /* ── Watermark ── */
        .watermark {
            position: fixed;
            top: 38%;
            left: 50%;
            margin-left: -120px;
            width: 240px;
            height: 240px;
            opacity: 0.045;
            z-index: -1;
        }

        /* ── Page wrapper ── */
        .page { padding: 0; }

        /* ── Header band ── */
        .header {
            background-color: #0F172A;
            padding: 28px 36px 22px;
        }
        .header-inner {
            width: 100%;
        }
        .header-left {
            display: inline-block;
            width: 60%;
            vertical-align: middle;
        }
        .header-right {
            display: inline-block;
            width: 38%;
            vertical-align: middle;
            text-align: right;
        }
        .studio-name {
            font-size: 17px;
            font-weight: bold;
            color: #FFFFFF;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .studio-tagline {
            font-size: 11px;
            color: #94A3B8;
            letter-spacing: .5px;
        }
        .invoice-label {
            font-size: 10px;
            color: #059669;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .invoice-number {
            font-size: 22px;
            font-weight: bold;
            color: #FFFFFF;
            letter-spacing: -0.5px;
        }
        .emerald-bar {
            height: 4px;
            background-color: #059669;
            margin: 0;
        }

        /* ── Body ── */
        .body { padding: 24px 36px; }

        /* ── Meta table ── */
        .meta-table { width: 100%; margin-bottom: 22px; }
        .meta-table td { vertical-align: top; width: 50%; padding: 0; }
        .meta-section-title {
            font-size: 9px;
            font-weight: bold;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 6px;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 4px;
        }
        .meta-name   { font-size: 14px; font-weight: bold; color: #0F172A; margin-bottom: 2px; }
        .meta-detail { font-size: 12px; color: #64748B; line-height: 1.6; }
        .meta-key    { font-weight: bold; color: #0F172A; }

        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
        }
        .s-pending    { background-color: #F1F5F9; color: #475569; }
        .s-processing { background-color: #DBEAFE; color: #1E40AF; }
        .s-ready      { background-color: #FEF3C7; color: #92400E; }
        .s-delivered  { background-color: #D1FAE5; color: #065F46; }
        .s-cancelled  { background-color: #FEE2E2; color: #991B1B; }

        /* ── Section title ── */
        .section-title {
            font-size: 9px;
            font-weight: bold;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 6px;
            margin-bottom: 0;
        }

        /* ── Items table ── */
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table thead tr { background-color: #059669; }
        .items-table th {
            padding: 9px 12px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            color: #FFFFFF;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
        .items-table th.right { text-align: right; }
        .items-table th.center { text-align: center; }

        .items-table td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px; }
        .items-table td.right  { text-align: right; font-weight: bold; }
        .items-table td.center { text-align: center; color: #64748B; }
        .items-table td.muted  { color: #64748B; }
        .items-table tbody tr:nth-child(even) td { background-color: #F8FAFC; }

        .cat-tag {
            display: inline-block;
            font-size: 9px;
            font-weight: bold;
            color: #059669;
            background-color: #ECFDF5;
            padding: 1px 6px;
            border-radius: 3px;
            text-transform: uppercase;
            letter-spacing: .3px;
            margin-bottom: 2px;
        }
        .item-name { font-size: 12px; font-weight: bold; display: block; color: #0F172A; }
        .item-size { font-size: 11px; color: #94A3B8; display: block; }

        .items-table tfoot tr { background-color: #0F172A; }
        .items-table tfoot td {
            padding: 11px 12px;
            color: #FFFFFF;
            font-weight: bold;
            font-size: 13px;
            border-bottom: none;
        }
        .items-table tfoot td.label { color: #94A3B8; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; }

        /* ── Payment summary ── */
        .payment-wrap { text-align: right; margin-bottom: 28px; }
        .payment-box {
            display: inline-block;
            background-color: #F8FAFC;
            border: 1.5px solid #E2E8F0;
            border-radius: 10px;
            padding: 14px 18px;
            min-width: 260px;
            text-align: left;
        }
        .payment-row { margin-bottom: 7px; }
        .payment-row-inner { width: 100%; }
        .pay-label { font-size: 12px; color: #64748B; display: inline-block; width: 50%; }
        .pay-val   { font-size: 12px; font-weight: bold; color: #0F172A; display: inline-block; width: 50%; text-align: right; }
        .pay-divider { border: none; border-top: 1px solid #E2E8F0; margin: 10px 0; }
        .pay-total { font-size: 15px; font-weight: bold; }
        .pay-balance { color: #DC2626; }
        .pay-paid    { color: #065F46; }

        /* ── Footer / branches ── */
        .footer {
            background-color: #0F172A;
            padding: 20px 36px 16px;
        }
        .footer-branches { width: 100%; margin-bottom: 14px; }
        .footer-branches td { vertical-align: top; width: 50%; padding: 0 12px 0 0; }
        .branch-name {
            font-size: 10px;
            font-weight: bold;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .branch-addr { font-size: 11px; color: #94A3B8; line-height: 1.7; }

        .footer-bottom {
            border-top: 1px solid #1E293B;
            padding-top: 12px;
        }
        .footer-bottom-inner { width: 100%; }
        .footer-web  { font-size: 11px; color: #059669; display: inline-block; width: 40%; }
        .footer-hours{ font-size: 11px; color: #64748B; display: inline-block; width: 35%; text-align: center; }
        .footer-since{ font-size: 11px; color: #64748B; display: inline-block; width: 24%; text-align: right; }
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
$balance = $order->total_amount - $order->amount_paid;
@endphp

{{-- Watermark --}}
<img class="watermark" src="{{ public_path('images/logo.png') }}" alt="">

<div class="page">

    {{-- Header --}}
    <div class="header">
        <div style="width:100%">
            <div class="header-left">
                <div class="studio-name">Focus Digital Color Lab</div>
                <div class="studio-tagline">www.focusdigitalcolorlab.com &nbsp;&bull;&nbsp; +880 1713-140768</div>
            </div><div class="header-right">
                <div class="invoice-label">Invoice</div>
                <div class="invoice-number">{{ $order->order_number }}</div>
            </div>
        </div>
    </div>
    <div class="emerald-bar"></div>

    {{-- Body --}}
    <div class="body">

        {{-- Meta --}}
        <table class="meta-table">
            <tr>
                <td style="padding-right:20px">
                    <div class="meta-section-title">Billed To</div>
                    <div class="meta-name">{{ $order->user->name }}</div>
                    @if($order->user->phone)
                        <div class="meta-detail">{{ $order->user->phone }}</div>
                    @endif
                </td>
                <td style="text-align:right">
                    <div class="meta-section-title" style="text-align:right">Order Details</div>
                    <div class="meta-detail">
                        <span class="meta-key">Date:</span> {{ $order->created_at->format('d M Y') }}<br>
                        <span class="meta-key">Branch:</span> {{ $order->location->name }}<br>
                        <span class="meta-key">Status:</span>
                        <span class="status-badge s-{{ $order->status }}">{{ ucfirst($order->status) }}</span>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Items --}}
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width:50%">Service</th>
                    <th class="center" style="width:10%">Qty</th>
                    <th class="right" style="width:18%">Unit Price</th>
                    <th class="right" style="width:18%">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <span class="cat-tag">{{ $categoryLabels[$item->product->category] ?? $item->product->category }}</span>
                        <span class="item-name">{{ $item->product->name }}</span>
                        @if($item->product->size_label)
                            <span class="item-size">{{ $item->product->size_label }}</span>
                        @endif
                    </td>
                    <td class="center">{{ $item->quantity }}</td>
                    <td class="right muted">৳{{ number_format($item->unit_price, 0) }}</td>
                    <td class="right">৳{{ number_format($item->subtotal, 0) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td class="label" colspan="3">Order Total</td>
                    <td class="right" style="font-size:15px">৳{{ number_format($order->total_amount, 0) }}</td>
                </tr>
            </tfoot>
        </table>

        {{-- Payment --}}
        <div class="payment-wrap">
            <div class="payment-box">
                <div class="payment-row">
                    <span class="pay-label">Order Total</span>
                    <span class="pay-val">৳{{ number_format($order->total_amount, 0) }}</span>
                </div>
                <div class="payment-row">
                    <span class="pay-label">Amount Paid</span>
                    <span class="pay-val">৳{{ number_format($order->amount_paid, 0) }}</span>
                </div>
                <hr class="pay-divider">
                @if($balance > 0)
                    <div>
                        <span class="pay-label pay-total pay-balance">Balance Due</span>
                        <span class="pay-val pay-total pay-balance" style="text-align:right;display:inline-block;width:50%">৳{{ number_format($balance, 0) }}</span>
                    </div>
                @else
                    <div>
                        <span class="pay-label pay-total pay-paid">Payment</span>
                        <span class="pay-val pay-total pay-paid" style="text-align:right;display:inline-block;width:50%">Paid in Full</span>
                    </div>
                @endif
            </div>
        </div>

    </div>

    {{-- Footer / branches --}}
    <div class="footer">
        <table class="footer-branches">
            <tr>
                <td>
                    <div class="branch-name">Bailey Road</div>
                    <div class="branch-addr">
                        Shantinagar Moar, Bailey Road<br>
                        Dhaka, Bangladesh
                    </div>
                </td>
                <td>
                    <div class="branch-name">Gulshan</div>
                    <div class="branch-addr">
                        House 5, Road 21, Gulshan-1<br>
                        Dhaka 1212, Bangladesh
                    </div>
                </td>
            </tr>
        </table>
        <div class="footer-bottom">
            <span class="footer-web">www.focusdigitalcolorlab.com</span>
            <span class="footer-hours">Sat–Thu 9:30 AM–9:00 PM &bull; Fri 3:00–9:00 PM</span>
            <span class="footer-since">Trusted since 2009</span>
        </div>
    </div>

</div>
</body>
</html>
