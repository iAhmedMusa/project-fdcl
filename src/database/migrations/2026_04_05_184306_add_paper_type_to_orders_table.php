<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('paper_type', 20)->nullable()->after('special_instructions');
        });

        // Migrate existing data: extract "Paper: Glossy" from special_instructions
        DB::table('orders')
            ->where('special_instructions', 'like', 'Paper: %')
            ->orderBy('id')
            ->each(function ($order) {
                $paperType = strtolower(str_replace('Paper: ', '', $order->special_instructions));
                DB::table('orders')->where('id', $order->id)->update([
                    'paper_type' => in_array($paperType, ['glossy', 'matte']) ? $paperType : null,
                    'special_instructions' => null,
                ]);
            });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('paper_type');
        });
    }
};
