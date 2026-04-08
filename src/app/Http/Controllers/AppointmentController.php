<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function create(): Response
    {
        $locations = Location::where('is_active', true)->get(['id', 'name', 'address']);

        return Inertia::render('Order/PhotoStudio', [
            'locations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'appointment_date' => 'required|date|after_or_equal:'.now()->toDateString(),
            'appointment_time' => 'required|string',
            'service_type' => 'required|string|in:general,passport,visa,family,event,school',
            'customer_name' => 'nullable|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:150',
            'notes' => 'nullable|string|max:500',
        ]);

        // Convert "09:00 AM" / "01:30 PM" → "09:00:00" / "13:30:00" for MySQL TIME column
        $time24 = date('H:i:s', strtotime($validated['appointment_time']));

        $appointment = Appointment::create([
            'user_id' => $request->user()?->id,
            'location_id' => $validated['location_id'],
            'customer_name' => $validated['customer_name'] ?? null,
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $time24,
            'service_type' => $validated['service_type'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        $displayTime = date('g:i A', strtotime($time24));

        return redirect('/')
            ->with('success', 'Appointment booked! We\'ll see you on '.$appointment->appointment_date->format('M d, Y').' at '.$displayTime.'.');
    }
}
