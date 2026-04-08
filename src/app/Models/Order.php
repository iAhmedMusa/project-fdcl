<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'location_id',
        'pickup_type',
        'status',
        'payment_status',
        'total_amount',
        'amount_paid',
        'notes',
        'special_instructions',
        'paper_type',
        'notified_at',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'notified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function photoRegistries(): BelongsToMany
    {
        return $this->belongsToMany(PhotoRegistry::class, 'order_photo_registry');
    }

    public function isAwaitingPhoto(): bool
    {
        if ($this->photoRegistries()->exists()) {
            return false;
        }

        foreach ($this->items as $item) {
            if ($item->product && $item->product->category === 'reprint') {
                return true;
            }
        }

        return false;
    }

    public function hasPhoto(): bool
    {
        return $this->photoRegistries()->exists() &&
            $this->photoRegistries()->first() !== null &&
            ! empty($this->photoRegistries()->first()->photo_paths);
    }

    protected function getIsAwaitingPhotoAttribute(): bool
    {
        return $this->isAwaitingPhoto();
    }
}
