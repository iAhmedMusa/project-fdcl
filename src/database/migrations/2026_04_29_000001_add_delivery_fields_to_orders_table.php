<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('delivery_type', ['regular', 'express'])->nullable()->after('pickup_type');
            $table->text('delivery_address')->nullable()->after('delivery_type');
            $table->text('delivery_instructions')->nullable()->after('delivery_address');
            $table->decimal('delivery_fee', 8, 2)->default(0)->after('delivery_instructions');
            $table->string('steadfast_consignment_id')->nullable()->after('delivery_fee');
            $table->string('steadfast_tracking_code')->nullable()->after('steadfast_consignment_id');
            $table->string('steadfast_delivery_status')->nullable()->after('steadfast_tracking_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'delivery_type',
                'delivery_address',
                'delivery_instructions',
                'delivery_fee',
                'steadfast_consignment_id',
                'steadfast_tracking_code',
                'steadfast_delivery_status',
            ]);
        });
    }
};
