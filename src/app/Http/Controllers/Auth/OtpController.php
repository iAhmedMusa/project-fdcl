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
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OtpController extends Controller
{
    public function show(Request $request): Response
    {
        $phone = $request->session()->get('otp_phone');

        if (! $phone) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'phone' => $phone,
            'expiresAt' => $request->session()->get('otp_expires_at'),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp_code' => 'required|string|size:6',
        ]);

        $phone = $request->session()->get('otp_phone');

        if (! $phone) {
            return redirect()->route('register');
        }

        $otp = Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (! $otp) {
            throw ValidationException::withMessages([
                'otp_code' => 'No pending verification found. Please register again.',
            ]);
        }

        if ($otp->isExpired()) {
            throw ValidationException::withMessages([
                'otp_code' => 'The OTP has expired. Please request a new one.',
            ]);
        }

        if ($otp->isMaxAttempts()) {
            throw ValidationException::withMessages([
                'otp_code' => 'Too many incorrect attempts. Please request a new OTP.',
            ]);
        }

        $otp->increment('attempts');

        if ($otp->otp_code !== $request->otp_code) {
            throw ValidationException::withMessages([
                'otp_code' => 'The OTP you entered is incorrect.',
            ]);
        }

        $otp->update(['verified_at' => now()]);

        $payload = $otp->payload;

        $user = User::create([
            'name' => $payload['name'],
            'phone' => $payload['phone'],
            'email' => $payload['email'] ?? null,
            'address' => $payload['address'] ?? null,
            'password' => Hash::make($payload['password']),
        ]);

        $user->assignRole('customer');

        event(new Registered($user));

        $request->session()->forget(['otp_phone', 'otp_expires_at']);

        Auth::login($user);

        return redirect()->intended(route('customer.dashboard', absolute: false));
    }

    public function resend(Request $request): RedirectResponse
    {
        $phone = $request->session()->get('otp_phone');

        if (! $phone) {
            return redirect()->route('register');
        }

        $lastOtp = Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if ($lastOtp && $lastOtp->isVerified()) {
            return redirect()->route('register');
        }

        if ($lastOtp && ! $lastOtp->isExpired()) {
            throw ValidationException::withMessages([
                'otp_code' => 'Please wait before requesting a new OTP.',
            ]);
        }

        $payload = $lastOtp ? $lastOtp->payload : [];

        if (empty($payload)) {
            return redirect()->route('register');
        }

        $sent = $this->createAndSendOtp($phone, $payload);

        if (! $sent) {
            throw ValidationException::withMessages([
                'otp_code' => 'We could not send the verification code right now. Please try again in a few minutes.',
            ]);
        }

        return back()->with('status', 'A new OTP has been sent to your phone.');
    }

    public function sendOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'max:20', 'regex:/^(\+8801|8801|01)[3-9]\d{8}$/'],
            'name' => 'required|string|max:255',
            'password' => ['required', 'string'],
        ]);

        $phone = User::normalizePhone($request->phone);

        $existingUser = User::where('phone', $phone)->first();
        if ($existingUser) {
            throw ValidationException::withMessages([
                'phone' => 'This phone number is already registered.',
            ]);
        }

        $payload = [
            'name' => $request->name,
            'phone' => $phone,
            'email' => $request->email,
            'address' => $request->address,
            'password' => $request->password,
        ];

        $sent = $this->createAndSendOtp($phone, $payload);

        if (! $sent) {
            throw ValidationException::withMessages([
                'phone' => 'We could not send the verification code right now. Please try again in a few minutes.',
            ]);
        }

        $request->session()->put('otp_phone', $phone);
        $request->session()->put('otp_expires_at', now()->addMinutes(5)->toIso8601String());
        $request->session()->put('otp_payload', $payload);

        return redirect()->route('otp.verify');
    }

    private function createAndSendOtp(string $phone, array $payload): bool
    {
        Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->delete();

        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(5);

        $sent = app(SmsService::class)->sendOtp($phone, $otpCode);

        if (! $sent) {
            return false;
        }

        Otp::create([
            'phone' => $phone,
            'otp_code' => $otpCode,
            'payload' => $payload,
            'expires_at' => $expiresAt,
            'attempts' => 0,
        ]);

        return true;
    }

    }