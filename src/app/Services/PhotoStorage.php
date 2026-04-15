<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class PhotoStorage
{
    public function store(UploadedFile $file, string $registryCode, ?string $orderNumber = null): string
    {
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = strtoupper($registryCode).'.'.$extension;

        if ($orderNumber) {
            $directory = 'orders/'.$orderNumber;
        } else {
            $directory = 'photos';
        }

        // return $file->storeAs($directory, $filename, 'public');
        return $file->storeAs($directory, $filename, config('filesystems.default'));
    }

    public function storeWithOrderNumber(UploadedFile $file, string $orderNumber): string
    {
        $filename = time().'_'.$file->getClientOriginalName();

        // return $file->storeAs('orders/'.$orderNumber, $filename, 'public');
        return $file->storeAs('orders/'.$orderNumber, $filename, config('filesystems.default'));
    }
}
