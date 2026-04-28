<?php

namespace App\Http\Controllers\Webhooks;

use App\Events\OrderStatusChanged;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class SteadfastWebhookController extends Controller
{
    // Steadfast status → FDCL order status
    private const STATUS_MAP = [
        'in_review'           => 'out_for_delivery',
        'accepted'            => 'out_for_delivery',
        'pending'             => 'out_for_delivery',
        'hold'                => 'out_for_delivery',
        'delivered_partially' => 'out_for_delivery',
        'delivered'           => 'delivered',
        'cancelled'           => 'cancelled',
    ];

    public function handle(Request $request): Response
    {
        // Validate Bearer token
        $token = config('services.steadfast.callback_token');
        $authorization = $request->header('Authorization', '');

        if ($token && $authorization !== "Bearer {$token}") {
            Log::warning('Steadfast webhook: invalid token');
            return response('Unauthorized', 401);
        }

        $invoice        = $request->input('invoice');
        $trackingCode   = $request->input('tracking_code');
        $deliveryStatus = $request->input('delivery_status');

        if (! $invoice || ! $deliveryStatus) {
            return response('Bad Request', 400);
        }

        $order = Order::where('order_number', $invoice)->first();

        if (! $order) {
            Log::warning('Steadfast webhook: order not found', ['invoice' => $invoice]);
            return response('OK', 200); // Return 200 so Steadfast doesn't retry
        }

        $order->steadfast_delivery_status = $deliveryStatus;

        if ($trackingCode) {
            $order->steadfast_tracking_code = $trackingCode;
        }

        $fdclStatus = self::STATUS_MAP[$deliveryStatus] ?? null;

        if ($fdclStatus && $order->status !== $fdclStatus) {
            $oldStatus   = $order->status;
            $order->status = $fdclStatus;
            $order->save();

            event(new OrderStatusChanged($order, $oldStatus));
        } else {
            $order->save();
        }

        return response('OK', 200);
    }
}
