<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'is_active',
        'is_walk_in',
        'location_id',
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_walk_in' => 'boolean',
        ];
    }

    public static function normalizePhone(?string $phone): ?string
    {
        if (! $phone) {
            return null;
        }

        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (preg_match('/^8801[3-9]\d{8}$/', $phone)) {
            $phone = '0' . substr($phone, 3);
        }

        if (preg_match('/^01[3-9]\d{8}$/', $phone)) {
            return $phone;
        }

        return $phone ?: null;
    }

    public function setPhoneAttribute($value): void
    {
        $this->attributes['phone'] = self::normalizePhone($value);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isStaff(): bool
    {
        return $this->hasRole('staff');
    }

    public function isCustomer(): bool
    {
        return $this->hasRole('customer');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function photoRegistries()
    {
        return $this->hasMany(PhotoRegistry::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
