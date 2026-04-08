<x-mail::message>
# Your Order Has Been Cancelled

Hello {{ $order->user->name }},

We're sorry, but your order has been cancelled.

<x-mail::panel>
<div style="text-align: center;">
<span style="font-size: 14px; color: #666;">Order Number</span><br>
<span style="font-size: 28px; font-weight: bold; color: #D4A017; letter-spacing: 2px;">{{ $order->order_number }}</span>
</div>
</x-mail::panel>

We apologize for any inconvenience this may have caused. If you have questions or would like to place a new order, please don't hesitate to contact us.

## Need Assistance?

Our team is here to help you:

📞 **Phone:** 01713-140768  
📍 **Shantinagar:** Shantinagar Moar, Bailly Road, Dhaka  
📍 **Gulshan-1:** House 5, Road 21, Gulshan-1, Dhaka 1212  
📧 **Email:** noreply@focuslab.com.bd

<x-mail::button :url="config('app.url')">
Place a New Order
</x-mail::button>

---

**Focus Digital Color Lab**
Shantinagar Moar, Bailly Road, Dhaka | House 5, Road 21, Gulshan-1, Dhaka 1212
Phone: 01713-140768
</x-mail::message>