<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class PhotoStorage
{
    private const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    public function store(UploadedFile $file, string $registryCode, ?string $orderNumber = null): string
    {
        if (! in_array($file->getMimeType(), self::ALLOWED_MIMES, true)) {
            throw ValidationException::withMessages([
                'photo' => 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.',
            ]);
        }

        $extension = $file->guessExtension() ?: 'jpg';
        $filename = strtoupper($registryCode).'.'.$extension;

        if ($orderNumber) {
            $directory = 'orders/'.$orderNumber;
        } else {
            $directory = 'photos';
        }

        return $file->storeAs($directory, $filename, config('filesystems.default'));
    }
}
