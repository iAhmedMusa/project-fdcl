<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1|max:'.($order->total_amount - $order->discount_amount - $order->amount_paid),
            'method' => 'required|in:cash,bkash,nagad,card,other',
            'reference' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        // Create payment record
        Payment::create([
            'order_id' => $order->id,
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'reference' => $validated['reference'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'paid_at' => now(),
            'recorded_by' => $request->user()->id,
        ]);

        // Recalculate total paid
        $totalPaid = $order->payments()->sum('amount');
        $effectiveTotal = $order->total_amount - $order->discount_amount;

        // Update order payment status
        $order->amount_paid = $totalPaid;

        if ($totalPaid >= $effectiveTotal) {
            $order->payment_status = 'paid';
        } elseif ($totalPaid > 0) {
            $order->payment_status = 'partial';
        } else {
            $order->payment_status = 'unpaid';
        }

        $order->save();

        return back()->with('success', "Payment of ৳{$validated['amount']} recorded successfully.");
    }
}
