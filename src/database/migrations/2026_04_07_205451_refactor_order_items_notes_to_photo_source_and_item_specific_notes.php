<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Rename notes to item_specific_notes
            $table->renameColumn('notes', 'item_specific_notes');
            
            // Add photo_source column
            $table->text('photo_source')->nullable()->after('photo_paths');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Rename back to notes
            $table->renameColumn('item_specific_notes', 'notes');
            
            // Drop photo_source
            $table->dropColumn('photo_source');
        });
    }
};