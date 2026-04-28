<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteadfastService
{
    private string $baseUrl;
    private string $apiKey;
    private string $secretKey;

    public function __construct()
    {
        $this->baseUrl   = rtrim(config('services.steadfast.base_url'), '/');
        $this->apiKey    = config('services.steadfast.api_key');
        $this->secretKey = config('services.steadfast.secret_key');
    }

    public function createConsignment(Order $order, string $itemType = 'document', float $weight = 0.5): array
    {
        $note = trim(
            'FDCL printed photo order. ' . ($order->delivery_instructions ?? '')
        );

        $payload = [
            'invoice'          => $order->order_number,
            'recipient_name'   => $order->user->name,
            'recipient_phone'  => $order->user->phone,
            'recipient_address'=> $order->delivery_address,
            'cod_amount'       => 0,
            'note'             => $note,
            'item_description' => $this->itemDescription($itemType),
            'item_type'        => $itemType,
            'weight'           => $weight,
            'service_type'     => $order->delivery_type === 'express' ? 2 : 1,
        ];

        return $this->request('POST', '/create_order', $payload);
    }

    public function getStatusByConsignmentId(string $consignmentId): array
    {
        return $this->request('GET', "/status_by_cid/{$consignmentId}");
    }

    public function getStatusByInvoice(string $invoice): array
    {
        return $this->request('GET', "/status_by_invoice/{$invoice}");
    }

    public function getStatusByTrackingCode(string $trackingCode): array
    {
        return $this->request('GET', "/status_by_trackingcode/{$trackingCode}");
    }

    private function request(string $method, string $path, array $data = []): array
    {
        $response = Http::withHeaders([
            'Api-Key'    => $this->apiKey,
            'Secret-Key' => $this->secretKey,
            'Content-Type' => 'application/json',
        ])->{strtolower($method)}($this->baseUrl . $path, $data);

        if ($response->failed()) {
            Log::error('Steadfast API error', [
                'path'   => $path,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            throw new \RuntimeException(
                'Steadfast API error: ' . ($response->json('message') ?? $response->body())
            );
        }

        return $response->json();
    }

    private function itemDescription(string $itemType): string
    {
        return match ($itemType) {
            'document' => 'Printed photo document in envelope',
            'parcel'   => 'Photo product (album/frame/mug)',
            default    => 'Photo order',
        };
    }
}
