<?php

namespace App\Http\Controllers;

use App\Models\InvoiceToken;
use App\Models\Order;
use App\Services\InvoiceService;
use App\Services\SmsService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    public function download(Request $request, Order $order): Response
    {
        $user = $request->user();

        if ($user->id !== $order->user_id && ! $user->hasRole(['staff', 'admin'])) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        $order->load(['items.product', 'user', 'location', 'payments.recorder', 'photoRegistries']);

        $pdf = Pdf::loadView('pdf.invoice', compact('order'));

        return $pdf->stream("FDCL-Invoice-{$order->order_number}.pdf");
    }

    public function showPublic(string $token): \Illuminate\Contracts\View\View
    {
        $invoiceToken = InvoiceToken::where('token', $token)->firstOrFail();

        if ($invoiceToken->isExpired()) {
            abort(410, 'This invoice link has expired.');
        }

        $order = $invoiceToken->order->load(['items.product', 'user', 'location', 'payments']);

        return view('invoice.public', compact('order', 'token'));
    }

    public function downloadPublic(string $token): Response
    {
        $invoiceToken = InvoiceToken::where('token', $token)->firstOrFail();

        if ($invoiceToken->isExpired()) {
            abort(410, 'This invoice link has expired.');
        }

        $order = $invoiceToken->order->load(['items.product', 'user', 'location', 'payments']);
        $pdf = Pdf::loadView('pdf.invoice', compact('order'));

        return $pdf->download("FDCL-Invoice-{$order->order_number}.pdf");
    }

    public function sendSms(Request $request, Order $order, InvoiceService $invoiceService, SmsService $smsService): \Illuminate\Http\JsonResponse
    {
        $phone = $order->user->phone ?? null;

        if (! $phone) {
            return response()->json(['message' => 'No phone number on this order.'], 422);
        }

        $token = $invoiceService->createOrRenewToken($order);
        $url   = $invoiceService->getPublicUrl($token);
        $sent  = $smsService->sendInvoiceLink($phone, $url, $order->order_number, $order->user->name ?? null);

        if (! $sent) {
            return response()->json(['message' => 'SMS could not be sent. Check logs.'], 500);
        }

        $token->update(['sms_sent' => true]);

        return response()->json(['message' => 'Invoice SMS sent successfully.']);
    }

    public function sendReadySms(Request $request, Order $order, InvoiceService $invoiceService, SmsService $smsService): \Illuminate\Http\JsonResponse
    {
        $phone = $order->user->phone ?? null;

        if (! $phone) {
            return response()->json(['message' => 'No phone number on this order.'], 422);
        }

        $token = $invoiceService->createOrRenewToken($order);
        $url   = $invoiceService->getPublicUrl($token);
        $sent  = $smsService->sendOrderReady($phone, $url, $order->order_number, $order->user->name);

        if (! $sent) {
            return response()->json(['message' => 'SMS could not be sent. Check logs.'], 500);
        }

        return response()->json(['message' => 'Order ready SMS sent successfully.']);
    }
}
