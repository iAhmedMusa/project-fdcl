<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Appointment Report — FDCL</title>
    @include('pdf.reports._base_styles')
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Focus Digital Color Lab</h1>
        <div class="separator"></div>
        <div class="report-title">APPOINTMENT REPORT</div>
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
                <th>Date</th>
                <th>Time</th>
                <th>Service</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Status</th>
                <th>Booked By</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $i => $row)
            <tr>
                <td>{{ $row['Date'] }}</td>
                <td>{{ $row['Time'] }}</td>
                <td>{{ $row['Service'] }}</td>
                <td>{{ $row['Name'] }}</td>
                <td>{{ $row['Phone'] }}</td>
                <td>{{ $row['Location'] }}</td>
                <td>{{ $row['Status'] }}</td>
                <td>{{ $row['Booked By'] }}</td>
            </tr>
            @if(($i + 1) % 25 === 0 && !$loop->last)
            </tbody></table>
            <div class="page-break"></div>
            <table class="items-table"><thead><tr>
                <th>Date</th><th>Time</th><th>Service</th><th>Name</th>
                <th>Phone</th><th>Location</th><th>Status</th><th>Booked By</th>
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
