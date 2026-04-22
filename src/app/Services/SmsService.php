<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    public function normalizePhone(string $phone): string
    {
        $phone = ltrim($phone, '+');
        if (preg_match('/^01[3-9]\d{8}$/', $phone)) {
            return '88' . $phone;
        }
        return $phone;
    }

    public function send(string $phone, string $message): bool
    {
        $apiKey = config('services.bulksms.api_key');
        $senderId = config('services.bulksms.sender_id');
        $url = config('services.bulksms.url');

        if (! $apiKey || ! $senderId) {
            Log::warning('BulkSMS credentials not configured. OTP would have been sent.', [
                'phone' => $phone,
                'message' => $message,
            ]);
            return true;
        }

        $phone = $this->normalizePhone($phone);

        try {
            $response = Http::get($url, [
                'api_key' => $apiKey,
                'type' => 'text',
                'number' => $phone,
                'senderid' => $senderId,
                'message' => $message,
            ]);

            $body = $response->json();

            if ($response->successful() && isset($body['response_code']) && $body['response_code'] === 0) {
                Log::info('SMS sent successfully', ['phone' => $phone]);
                return true;
            }

            $errorMsg = $body['error_message'] ?? $response->body();
            Log::error('SMS sending failed', [
                'phone' => $phone,
                'response_code' => $body['response_code'] ?? null,
                'error' => $errorMsg,
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('SMS sending exception', [
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function sendOtp(string $phone, string $otp): bool
    {
        $message = "Your Focus Digital Color Lab verification code is: {$otp}. We are happy to have you.";
        return $this->send($phone, $message);
    }

    public function getBalance(): ?float
    {
        $apiKey = config('services.bulksms.api_key');
        $url = config('services.bulksms.balance_url');

        if (! $apiKey) {
            return null;
        }

        try {
            $response = Http::timeout(10)->get($url, [
                'api_key' => $apiKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (is_array($data) && isset($data['balance'])) {
                    return (float) $data['balance'];
                }

                return (float) $response->body();
            }
        } catch (\Exception $e) {
            Log::error('BulkSMS balance check failed', ['error' => $e->getMessage()]);
        }

        return null;
    }
}