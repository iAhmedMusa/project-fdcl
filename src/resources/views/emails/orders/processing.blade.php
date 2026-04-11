<x-mail::message>
# Your Photos Are Being Printed

Hello {{ $order->user->name }},

Good news! Your photos are now being printed by our team.

<x-mail::panel>
<div style="text-align: center;">
<span style="font-size: 14px; color: #666;">Order Number</span><br>
<span style="font-size: 28px; font-weight: bold; color: #D4A017; letter-spacing: 2px;">{{ $order->order_number }}</span>
</div>
</x-mail::panel>

## What's Next?

Your order will be ready for pickup **within 30 minutes**. We'll notify you as soon as it's ready.

**Pickup Location:**

{{ $order->location->name }} — {{ $order->location->address }}

**Business Hours:**
- Saturday–Thursday: 9:30 AM – 9:00 PM
- Friday: 3:00 PM – 9:00 PM

<x-mail::button :url="config('app.url')">
Track Your Order
</x-mail::button>

---

**Focus Digital Color Lab**
Shantinagar Moar, Bailey Road, Dhaka | House 5, Road 21, Gulshan-1, Dhaka 1212
Phone: 01713-140768
</x-mail::message>