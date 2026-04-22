<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('studio_fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained()->cascadeOnDelete();
            $table->decimal('fee', 10, 2)->default(200.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique('location_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('studio_fees');
    }
};