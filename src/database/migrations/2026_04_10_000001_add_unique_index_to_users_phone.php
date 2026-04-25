<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $duplicates = DB::table('users')
            ->select('phone', DB::raw('COUNT(*) as count'))
            ->whereNotNull('phone')
            ->where('phone', '!=', '')
            ->groupBy('phone')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $dup) {
            $users = DB::table('users')
                ->where('phone', $dup->phone)
                ->orderBy('created_at', 'asc')
                ->get();

            $first = true;
            foreach ($users as $user) {
                if ($first) {
                    $first = false;
                    continue;
                }
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['phone' => null]);
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->unique('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['phone']);
        });
    }
};