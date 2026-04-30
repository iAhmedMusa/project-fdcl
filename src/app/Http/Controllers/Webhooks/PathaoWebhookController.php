<?php

namespace App\Http\Controllers\Webhooks;

use App\Events\OrderStatusChanged;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PathaoWebhookController extends Controller
{
    // Pathao order_status_slug → FDCL status
    private const STATUS_MAP = [
        'Pending'              => 'out_for_delivery',
        'Pickup_Requested'     => 'out_for_delivery',
        'Pickup_Completed'     => 'out_for_delivery',
        'Pickup_Failed'        => 'out_for_delivery',
        'In_Transit'           => 'out_for_delivery',
        'Transfer_To_Hub'      => 'out_for_delivery',
        'Out_for_Delivery'     => 'out_for_delivery',
        'On_Hold'              => 'out_for_delivery',
        'Partial_Delivered'    => 'out_for_delivery',
        'Delivered'            => 'delivered',
        'Cancelled'            => 'cancelled',
        'Return_In_Transit'    => 'cancelled',
        'Return_Completed'     => 'cancelled',
    ];

    public function handle(Request $request): Response
    {
        $secret = config('services.pathao.webhook_token');

        Log::info('Pathao webhook received', $request->all());

        $consignmentId  = $request->input('consignment_id');
        $merchantOrderId = $request->input('merchant_order_id');
        $orderStatus    = $request->input('order_status') ?? $request->input('order_status_slug');

        // Find order by merchant_order_id (our order_number) or consignment_id
        $order = null;
        if ($merchantOrderId) {
            $order = Order::where('order_number', $merchantOrderId)->first();
        }
        if (! $order && $consignmentId) {
            $order = Order::where('pathao_consignment_id', $consignmentId)->first();
        }

        if (! $order) {
            Log::warning('Pathao webhook: order not found', compact('merchantOrderId', 'consignmentId'));
            return response('OK', 202)
                ->header('X-Pathao-Merchant-Webhook-Integration-Secret', $secret ?? '');
        }

        $order->pathao_delivery_status = $orderStatus;
        $order->save();

        $fdclStatus = self::STATUS_MAP[$orderStatus] ?? null;

        if ($fdclStatus && $order->status !== $fdclStatus) {
            $oldStatus     = $order->status;
            $order->status = $fdclStatus;
            $order->save();
            event(new OrderStatusChanged($order, $oldStatus));
        }

        return response('OK', 202)
            ->header('X-Pathao-Merchant-Webhook-Integration-Secret', $secret ?? '');
    }
}
