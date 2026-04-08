<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(): Response
    {
        $appointments = Appointment::with(['user', 'location'])
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'appointment_date' => $a->appointment_date->format('M d, Y'),
                    'appointment_time' => date('g:i A', strtotime($a->appointment_time)),
                    'service_type' => $a->service_type,
                    'status' => $a->status,
                    'customer_name' => $a->customer_name,
                    'customer_phone' => $a->customer_phone,
                    'customer_email' => $a->customer_email,
                    'notes' => $a->notes,
                    'location' => $a->location?->name ?? '—',
                    'booked_by' => $a->user?->name ?? 'Guest',
                    'created_at' => $a->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Staff/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:attended,cancelled',
        ]);

        $appointment->update(['status' => $request->status]);

        return back()->with('success', 'Appointment marked as '.$request->status.'.');
    }
}
