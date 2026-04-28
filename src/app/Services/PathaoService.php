<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PathaoService
{
    private const DELIVERY_TYPE_NORMAL    = 48;
    private const DELIVERY_TYPE_ON_DEMAND = 12;

    private const ITEM_TYPE_DOCUMENT = 1;
    private const ITEM_TYPE_PARCEL   = 2;

    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.pathao.base_url'), '/');
    }

    /**
     * Create a Pathao consignment for a delivery order.
     *
     * @param  int  $itemType  1 = document, 2 = parcel
     */
    public function createOrder(Order $order, int $itemType = self::ITEM_TYPE_DOCUMENT, float $weight = 0.5): array
    {
        $storeId = $order->location?->pathao_store_id
            ?? config('services.pathao.default_store_id');

        if (! $storeId) {
            throw new \RuntimeException('No Pathao store_id configured for this location.');
        }

        $payload = [
            'store_id'           => (int) $storeId,
            'merchant_order_id'  => $order->order_number,
            'recipient_name'     => $order->user->name,
            'recipient_phone'    => $order->user->phone,
            'recipient_address'  => $order->delivery_address,
            'delivery_type'      => $order->delivery_type === 'express'
                                    ? self::DELIVERY_TYPE_ON_DEMAND
                                    : self::DELIVERY_TYPE_NORMAL,
            'item_type'          => $itemType,
            'item_quantity'      => 1,
            'item_weight'        => $weight,
            'item_description'   => $this->itemDescription($itemType),
            'special_instruction'=> $order->delivery_instructions ?? '',
            'amount_to_collect'  => 0,
        ];

        return $this->request('POST', '/aladdin/api/v1/orders', $payload);
    }

    public function getOrderInfo(string $consignmentId): array
    {
        return $this->request('GET', "/aladdin/api/v1/orders/{$consignmentId}/info");
    }

    public function getStores(): array
    {
        return $this->request('GET', '/aladdin/api/v1/stores');
    }

    // ── Token management ────────────────────────────────────────────────────

    private function getAccessToken(): string
    {
        if (Cache::has('pathao_access_token')) {
            return Cache::get('pathao_access_token');
        }

        $refreshToken = Cache::get('pathao_refresh_token');

        if ($refreshToken) {
            try {
                return $this->issueToken([
                    'client_id'     => config('services.pathao.client_id'),
                    'client_secret' => config('services.pathao.client_secret'),
                    'grant_type'    => 'refresh_token',
                    'refresh_token' => $refreshToken,
                ]);
            } catch (\RuntimeException) {
                // Fall through to password grant
            }
        }

        return $this->issueToken([
            'client_id'     => config('services.pathao.client_id'),
            'client_secret' => config('services.pathao.client_secret'),
            'grant_type'    => 'password',
            'username'      => config('services.pathao.username'),
            'password'      => config('services.pathao.password'),
        ]);
    }

    private function issueToken(array $payload): string
    {
        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->post($this->baseUrl . '/aladdin/api/v1/issue-token', $payload);

        if ($response->failed()) {
            Log::error('Pathao token issue failed', ['body' => $response->body()]);
            throw new \RuntimeException('Pathao auth failed: ' . $response->body());
        }

        $data = $response->json();

        $ttl = max(60, (int) ($data['expires_in'] ?? 432000) - 60);

        Cache::put('pathao_access_token', $data['access_token'], $ttl);
        Cache::put('pathao_refresh_token', $data['refresh_token'], now()->addDays(30));

        return $data['access_token'];
    }

    // ── HTTP ─────────────────────────────────────────────────────────────────

    private function request(string $method, string $path, array $data = []): array
    {
        $token = $this->getAccessToken();

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Content-Type'  => 'application/json; charset=UTF-8',
        ])->{strtolower($method)}($this->baseUrl . $path, $data);

        if ($response->failed()) {
            Log::error('Pathao API error', [
                'path'   => $path,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            // 401 = token stale — clear cache and retry once
            if ($response->status() === 401) {
                Cache::forget('pathao_access_token');
                $token    = $this->getAccessToken();
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Content-Type'  => 'application/json; charset=UTF-8',
                ])->{strtolower($method)}($this->baseUrl . $path, $data);
            }

            if ($response->failed()) {
                throw new \RuntimeException(
                    'Pathao API error: ' . ($response->json('message') ?? $response->body())
                );
            }
        }

        return $response->json();
    }

    private function itemDescription(int $itemType): string
    {
        return match ($itemType) {
            self::ITEM_TYPE_DOCUMENT => 'Printed photo document in envelope',
            self::ITEM_TYPE_PARCEL   => 'Photo product (album/frame/mug)',
            default                  => 'Photo order',
        };
    }
}
