<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FDCL Invoice - {{ $order->order_number }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 0;
            color: #1a1a1a;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            background-color: #0D1B2A;
            color: white;
            padding: 30px;
            margin: -40px -40px 30px -40px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header .separator {
            width: 60px;
            height: 3px;
            background-color: #D4A017;
            margin: 10px auto;
        }
        .header .invoice-number {
            font-size: 18px;
            color: #D4A017;
            margin-top: 10px;
        }
        .studio-info {
            text-align: center;
            margin-bottom: 30px;
            font-size: 13px;
            color: #666;
        }
        .studio-info p {
            margin: 5px 0;
        }
        .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .order-info-left, .order-info-right {
            width: 48%;
        }
        .order-info h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 14px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .order-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table thead {
            background-color: #0D1B2A;
            color: white;
        }
        .items-table th {
            padding: 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
        }
        .items-table th:last-child {
            text-align: right;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
        }
        .items-table td:last-child {
            text-align: right;
        }
        .items-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .items-table tfoot td {
            border-top: 2px solid #0D1B2A;
            font-weight: 700;
        }
        .payment-box {
            background-color: #f5f5f5;
            border: 2px solid #0D1B2A;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .payment-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .payment-row.total {
            font-weight: 700;
            font-size: 18px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
            margin-top: 10px;
        }
        .payment-row .amount {
            font-weight: 700;
        }
        .payment-row.balance {
            color: #dc2626;
        }
        .photo-id-box {
            background-color: #FFF8E7;
            border: 2px solid #D4A017;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .photo-id-box h4 {
            margin: 0 0 10px 0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #D4A017;
        }
        .photo-id-box .code {
            font-size: 28px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            color: #0D1B2A;
            margin: 10px 0;
        }
        .photo-id-box p {
            font-size: 13px;
            color: #666;
            margin: 10px 0 0 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #999;
        }
        .footer p {
            margin: 5px 0;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-pending { background-color: #f3f4f6; color: #4b5563; }
        .status-processing { background-color: #dbeafe; color: #1e40af; }
        .status-ready { background-color: #fef3c7; color: #92400e; }
        .status-delivered { background-color: #d1fae5; color: #065f46; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Focus Digital Color Lab</h1>
            <div class="separator"></div>
            <div class="invoice-number">INVOICE {{ $order->order_number }}</div>
        </div>

        <div class="studio-info">
            <p><strong>Shantinagar:</strong> Shantinagar Moar, Bailly Road, Dhaka | <strong>Gulshan-1:</strong> House 5, Road 21, Gulshan-1, Dhaka 1212</p>
            <p>Phone: 01713-140768 | Website: https://focuslab.com.bd</p>
        </div>

        <div class="order-info">
            <div class="order-info-left">
                <h3>Invoice To</h3>
                <p><strong>{{ $order->user->name }}</strong></p>
                <p>{{ $order->user->email }}</p>
                @if($order->user->phone)
                    <p>{{ $order->user->phone }}</p>
                @endif
            </div>
            <div class="order-info-right">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
                <p><strong>Date:</strong> {{ $order->created_at->format('M d, Y H:i') }}</p>
                <p><strong>Location:</strong> {{ $order->location->name }}</p>
                <p><strong>Status:</strong>
                    <span class="status status-{{ $order->status }}">
                        {{ ucfirst($order->status) }}
                    </span>
                </p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Size</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->product->name }}</td>
                    <td>{{ $item->product->size_label ?? '—' }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">৳{{ number_format($item->unit_price, 0) }}</td>
                    <td style="text-align: right;">৳{{ number_format($item->subtotal, 0) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" style="text-align: right;"><strong>Total</strong></td>
                    <td><strong>৳{{ number_format($order->total_amount, 0) }}</strong></td>
                </tr>
            </tfoot>
        </table>

        <div class="payment-box">
            <div class="payment-row">
                <span>Total Amount:</span>
                <span class="amount">৳{{ number_format($order->total_amount, 0) }}</span>
            </div>
            <div class="payment-row">
                <span>Amount Paid:</span>
                <span class="amount">৳{{ number_format($order->amount_paid, 0) }}</span>
            </div>
            @if($order->total_amount - $order->amount_paid > 0)
            <div class="payment-row balance total">
                <span>Balance Due:</span>
                <span class="amount">৳{{ number_format($order->total_amount - $order->amount_paid, 0) }}</span>
            </div>
            @else
            <div class="payment-row total" style="color: #065f46;">
                <span>Status:</span>
                <span class="amount">PAID</span>
            </div>
            @endif
        </div>

        @if($order->photoRegistries->first())
        <div class="photo-id-box">
            <h4>Your FDCL Photo ID</h4>
            <div class="code">{{ $order->photoRegistries->first()->registry_code }}</div>
            <p>Save this code to reorder your photos any time without re-uploading.</p>
        </div>
        @endif

        <div class="footer">
            <p><strong>Thank you for choosing Focus Digital Color Lab!</strong></p>
            <p>For any questions, please call <strong>01713-140768</strong></p>
            <p style="margin-top: 15px; font-size: 11px;">Business Hours: Sat–Thu 9:30 AM – 9:00 PM | Fri 3:00 PM – 9:00 PM</p>
        </div>
    </div>
</body>
</html>