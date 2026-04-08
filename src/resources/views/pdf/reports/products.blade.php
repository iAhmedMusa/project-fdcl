<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Product Performance Report — FDCL</title>
    @include('pdf.reports._base_styles')
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Focus Digital Color Lab</h1>
        <div class="separator"></div>
        <div class="report-title">PRODUCT PERFORMANCE REPORT</div>
        <div class="meta">{{ $from->format('M d, Y') }} — {{ $to->format('M d, Y') }} | {{ $locationName }}</div>
    </div>

    <div class="summary-grid">
        @foreach($summary as $label => $value)
        <div class="summary-tile">
            <div class="tile-label">{{ $label }}</div>
            <div class="tile-value">{{ $value }}</div>
        </div>
        @endforeach
    </div>

    @if(empty($data))
        <p style="text-align:center; color:#888; padding:30px 0;">No data for the selected period.</p>
    @else
    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Size</th>
                <th style="text-align:center;">Units Sold</th>
                <th style="text-align:right;">Revenue (৳)</th>
                <th style="text-align:center;">Orders</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $row)
            <tr>
                <td style="font-weight:600;">{{ $row['Product'] }}</td>
                <td>{{ $row['Category'] }}</td>
                <td>{{ $row['Size'] }}</td>
                <td style="text-align:center;">{{ $row['Units Sold'] }}</td>
                <td style="text-align:right;">{{ $row['Revenue (৳)'] }}</td>
                <td style="text-align:center;">{{ $row['Orders'] }}</td>
            </tr>
            @if(($i + 1) % 25 === 0 && !$loop->last)
            </tbody></table>
            <div class="page-break"></div>
            <table class="items-table"><thead><tr>
                <th>Product</th><th>Category</th><th>Size</th>
                <th style="text-align:center;">Units Sold</th>
                <th style="text-align:right;">Revenue (৳)</th>
                <th style="text-align:center;">Orders</th>
            </tr></thead><tbody>
            @endif
            @endforeach
        </tbody>
    </table>
    @endif

    <div class="footer">
        <p>Generated {{ now()->format('M d, Y H:i') }} · Focus Digital Color Lab · 01713-140768</p>
    </div>
</div>
</body>
</html>
