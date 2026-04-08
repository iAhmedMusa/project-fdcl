<x-mail::message>
# Thank You! Your Order is Complete

Hello {{ $order->user->name }},

Thank you for choosing Focus Digital Color Lab! Your order has been successfully delivered.

<x-mail::panel>
<div style="text-align: center;">
<span style="font-size: 28px; color: #0D1B2A;">🎉</span><br>
<span style="font-size: 14px; color: #666;">Order Number</span><br>
<span style="font-size: 28px; font-weight: bold; color: #D4A017; letter-spacing: 2px;">{{ $order->order_number }}</span>
</div>
</x-mail::panel>

## We'd Love Your Feedback!

Had a great experience? We'd be grateful if you could leave us a review on Google. Your feedback helps us improve and helps others find us.

<x-mail::button :url="'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA'" color="primary">
Leave a Google Review
</x-mail::button>

## Want to Reorder?

If you have an FDCL Photo ID, you can reorder your photos anytime without re-uploading.

<x-mail::button :url="route('reprint.create')">
Reorder Photos
</x-mail::button>

---

**Focus Digital Color Lab**
Shantinagar Moar, Bailly Road, Dhaka | House 5, Road 21, Gulshan-1, Dhaka 1212
Phone: 01713-140768

Thank you for your trust in our services!
</x-mail::message>