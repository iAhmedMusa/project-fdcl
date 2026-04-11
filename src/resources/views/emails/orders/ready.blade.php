<x-mail::message>
# Your Order is Ready for Pickup!

Hello {{ $order->user->name }},

Great news! Your order is now ready for pickup.

<x-mail::panel>
<div style="text-align: center;">
<span style="font-size: 18px; color: #0D1B2A; font-weight: bold;">✓ READY FOR PICKUP</span><br>
<span style="font-size: 14px; color: #666;">Order Number</span><br>
<span style="font-size: 28px; font-weight: bold; color: #D4A017; letter-spacing: 2px;">{{ $order->order_number }}</span>
</div>
</x-mail::panel>

## Pickup Details

<div style="background-color: #FFF8E7; border-left: 4px solid #D4A017; padding: 16px; margin: 20px 0;">
<strong style="color: #0D1B2A; font-size: 18px;">{{ $order->location->name }}</strong><br>
<span style="color: #666; font-size: 14px;">{{ $order->location->address }}</span><br><br>
<strong style="color: #0D1B2A;">Business Hours:</strong><br>
<span style="color: #666; font-size: 14px;">
Saturday–Thursday: 9:30 AM – 9:00 PM<br>
Friday: 3:00 PM – 9:00 PM
</span>
</div>

**Important:** Please bring your order number **{{ $order->order_number }}** when you come to pickup.

<x-mail::button :url="config('app.url')">
View Order Details
</x-mail::button>

---

**Focus Digital Color Lab**
Shantinagar Moar, Bailey Road, Dhaka | House 5, Road 21, Gulshan-1, Dhaka 1212
Phone: 01713-140768
</x-mail::message>