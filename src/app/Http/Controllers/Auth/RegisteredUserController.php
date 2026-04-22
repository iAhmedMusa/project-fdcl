<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Otp;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(Request $request): Response
    {
        if ($request->has('intended')) {
            $request->session()->put('url.intended', $request->get('intended'));
        }

        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'phone'    => ['required', 'string', 'max:20', 'regex:/^(\+8801|8801|01)[3-9]\d{8}$/', 'unique:'.User::class],
            'email'    => 'nullable|string|lowercase|email|max:255|unique:'.User::class,
            'address'  => 'nullable|string|max:500',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $phone = User::normalizePhone($request->phone);

        $payload = [
            'name' => $request->name,
            'phone' => $phone,
            'email' => $request->email ?: null,
            'address' => $request->address,
            'password' => $request->password,
        ];

        return $this->initiateOtpVerification($request, $phone, $payload);
    }

    private function initiateOtpVerification(Request $request, string $phone, array $payload): RedirectResponse
    {
        Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->delete();

        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(5);

        $sent = app(SmsService::class)->sendOtp($phone, $otpCode);

        if (! $sent) {
            throw ValidationException::withMessages([
                'phone' => 'We could not send the verification code right now. Please try again in a few minutes.',
            ]);
        }

        Otp::create([
            'phone' => $phone,
            'otp_code' => $otpCode,
            'payload' => $payload,
            'expires_at' => $expiresAt,
            'attempts' => 0,
        ]);

        $request->session()->put('otp_phone', $phone);
        $request->session()->put('otp_expires_at', $expiresAt->toIso8601String());

        return redirect()->route('otp.verify');
    }
}