<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    public function download(Request $request, Order $order): Response
    {
        $user = $request->user();

        // Authorization: only order owner or staff/admin can download
        if ($user->id !== $order->user_id && ! $user->hasRole(['staff', 'admin'])) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        $order->load(['items.product', 'user', 'location', 'payments.recorder', 'photoRegistries']);

        $pdf = Pdf::loadView('pdf.invoice', compact('order'));

        return $pdf->download("FDCL-Invoice-{$order->order_number}.pdf");
    }
}
