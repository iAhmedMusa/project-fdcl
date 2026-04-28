<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('steadfast_consignment_id', 'pathao_consignment_id');
            $table->renameColumn('steadfast_delivery_status', 'pathao_delivery_status');
            $table->dropColumn('steadfast_tracking_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('pathao_consignment_id', 'steadfast_consignment_id');
            $table->renameColumn('pathao_delivery_status', 'steadfast_delivery_status');
            $table->string('steadfast_tracking_code')->nullable();
        });
    }
};
