<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_photo_registry', function (Blueprint $table) {
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('photo_registry_id')->constrained()->cascadeOnDelete();
            $table->primary(['order_id', 'photo_registry_id']);
        });

        Schema::table('photo_registries', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('photo_registries', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->constrained();
        });

        Schema::dropIfExists('order_photo_registry');
    }
};
