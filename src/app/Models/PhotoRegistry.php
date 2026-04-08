<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PhotoRegistry extends Model
{
    use HasFactory;

    protected $fillable = [
        'registry_code',
        'user_id',
        'photo_paths',
        'notes',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'photo_paths' => 'array',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_photo_registry');
    }
}
