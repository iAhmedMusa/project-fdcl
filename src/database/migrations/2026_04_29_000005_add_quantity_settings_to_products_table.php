<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('min_quantity')->default(4)->after('copies_per_sheet');
            $table->unsignedInteger('quantity_step')->default(2)->after('min_quantity');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['min_quantity', 'quantity_step']);
        });
    }
};
