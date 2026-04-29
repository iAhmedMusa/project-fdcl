<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'flag_emoji',
        'category',
        'size_label',
        'width_mm',
        'height_mm',
        'price',
        'copies_per_sheet',
        'min_quantity',
        'quantity_step',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'width_mm' => 'decimal:2',
            'height_mm' => 'decimal:2',
            'price' => 'decimal:2',
            'min_quantity' => 'integer',
            'quantity_step' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
