<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\StudioFee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudioFeeController extends Controller
{
    public function index(): Response
    {
        $studioFees = StudioFee::with('location')
            ->whereHas('location', fn ($q) => $q->where('is_active', true))
            ->get()
            ->map(fn ($fee) => [
                'id' => $fee->id,
                'location_id' => $fee->location_id,
                'location_name' => $fee->location->name,
                'fee' => (float) $fee->fee,
                'is_active' => $fee->is_active,
            ]);

        $locations = Location::where('is_active', true)
            ->whereDoesntHave('studioFee')
            ->get(['id', 'name'])
            ->map(fn ($loc) => ['id' => $loc->id, 'name' => $loc->name]);

        return Inertia::render('Admin/StudioFees/Index', [
            'studioFees' => $studioFees,
            'availableLocations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id|unique:studio_fees,location_id',
            'fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        StudioFee::create($validated);

        return redirect()->route('admin.studio-fees.index')
            ->with('success', 'Studio fee created successfully.');
    }

    public function update(Request $request, StudioFee $studioFee): RedirectResponse
    {
        $validated = $request->validate([
            'fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $studioFee->update($validated);

        return redirect()->route('admin.studio-fees.index')
            ->with('success', 'Studio fee updated successfully.');
    }

    public function toggleActive(StudioFee $studioFee): RedirectResponse
    {
        $studioFee->is_active = ! $studioFee->is_active;
        $studioFee->save();

        $status = $studioFee->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Studio fee {$status} successfully.");
    }
}