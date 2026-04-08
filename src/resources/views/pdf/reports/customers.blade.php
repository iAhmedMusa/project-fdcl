<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customer Report — FDCL</title>
    @include('pdf.reports._base_styles')
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Focus Digital Color Lab</h1>
        <div class="separator"></div>
        <div class="report-title">CUSTOMER REPORT</div>
        <div class="meta">New customers: {{ $from->format('M d, Y') }} — {{ $to->format('M d, Y') }}</div>
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
                <th>Name</th>
                <th>Phone</th>
                <th>Type</th>
                <th style="text-align:center;">Orders</th>
                <th style="text-align:right;">Total Spent (৳)</th>
                <th>Last Order</th>
                <th>Joined</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $row)
            <tr>
                <td style="font-weight:600;">{{ $row['Name'] }}</td>
                <td>{{ $row['Phone'] }}</td>
                <td>{{ $row['Type'] }}</td>
                <td style="text-align:center;">{{ $row['Orders'] }}</td>
                <td style="text-align:right;">{{ $row['Total Spent (৳)'] }}</td>
                <td>{{ $row['Last Order'] }}</td>
                <td>{{ $row['Joined'] }}</td>
            </tr>
            @if(($i + 1) % 25 === 0 && !$loop->last)
            </tbody></table>
            <div class="page-break"></div>
            <table class="items-table"><thead><tr>
                <th>Name</th><th>Phone</th><th>Type</th>
                <th style="text-align:center;">Orders</th><th style="text-align:right;">Total Spent (৳)</th>
                <th>Last Order</th><th>Joined</th>
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
