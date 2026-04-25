<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PhotoRegistry;
use RuntimeException;

class OrderNumberGenerator
{
    private const DIGITS = '23456789';

    private const LETTERS = 'ABCDEFGHJKLMNPQRTUVWXYZ';

    public function generate(): string
    {
        return $this->generateUniqueOrderNumber();
    }

    public function generateRegistryCode(): string
    {
        return $this->generateUniqueRegistryCode();
    }

    private function generateUniqueOrderNumber(): string
    {
        for ($i = 0; $i < 10; $i++) {
            $number = 'ORD-'.$this->orderCode();

            if (! Order::where('order_number', $number)->exists()) {
                return $number;
            }
        }

        throw new RuntimeException('Failed to generate a unique order number after 10 attempts.');
    }

    private function generateUniqueRegistryCode(): string
    {
        for ($i = 0; $i < 10; $i++) {
            $code = 'FDCL-'.$this->randomCode();

            if (! PhotoRegistry::where('registry_code', $code)->exists()) {
                return $code;
            }
        }

        throw new RuntimeException('Failed to generate a unique registry code after 10 attempts.');
    }

    private function orderCode(): string
    {
        $year = now()->format('y');
        $month = now()->format('m');
        $random = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        return $year.$month.$random;
    }

    private function randomCode(): string
    {
        $digits = self::DIGITS;
        $letters = self::LETTERS;
        $pool = $digits.$letters;

        $parts = [
            $digits[random_int(0, strlen($digits) - 1)],
            $digits[random_int(0, strlen($digits) - 1)],
            $letters[random_int(0, strlen($letters) - 1)],
            $letters[random_int(0, strlen($letters) - 1)],
            $pool[random_int(0, strlen($pool) - 1)],
            $pool[random_int(0, strlen($pool) - 1)],
        ];

        shuffle($parts);

        return implode('', $parts);
    }
}
