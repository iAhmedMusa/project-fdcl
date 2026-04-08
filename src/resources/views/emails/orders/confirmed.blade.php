<x-mail::message>
# Order Confirmed

Hello {{ $order->user->name }},

Thank you for your order! We've received it and will start preparing it right away.

<x-mail::panel>
<div style="text-align: center;">
<span style="font-size: 14px; color: #666;">Order Number</span><br>
<span style="font-size: 28px; font-weight: bold; color: #D4A017; letter-spacing: 2px;">{{ $order->order_number }}</span>
</div>
</x-mail::panel>

## Order Details

<x-mail::table>
| Product | Size | Qty | Price |
|:--------|:-----|:---:|------:|
@foreach ($order->items as $item)
| {{ $item->product->name }} | {{ $item->product->size_label ?? '—' }} | {{ $item->quantity }} | ৳{{ number_format($item->subtotal, 0) }} |
@endforeach
| | | **Total** | **৳{{ number_format($order->total_amount, 0) }}** |
</x-mail::table>

**Pickup Location:** {{ $order->location->name }} — {{ $order->location->address }}
**Hours:** Sat–Thu 9:30 AM – 9:00 PM, Fri 3:00 PM – 9:00 PM

@if ($registry)
<x-mail::panel>
<div style="border: 2px solid #D4A017; border-radius: 8px; padding: 16px; text-align: center;">
<span style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your FDCL Photo ID</span><br>
<span style="font-size: 24px; font-weight: bold; color: #D4A017;">{{ $registry->registry_code }}</span><br>
<span style="font-size: 13px; color: #666;">Save this code to reorder your photos any time.</span>
</div>
</x-mail::panel>
@endif

<x-mail::button :url="config('app.url')" color="primary">
View Your Orders
</x-mail::button>

---

**Focus Digital Color Lab**
Shantinagar Moar, Bailly Road, Dhaka | House 5, Road 21, Gulshan-1, Dhaka 1212
Phone: 01713-140768

</x-mail::message>
