<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Otp;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordOtpController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function sendOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'max:20', 'regex:/^(\+8801|8801|01)[3-9]\d{8}$/'],
        ], [
            'phone.regex' => 'Please enter a valid Bangladeshi phone number.',
        ]);

        $phone = User::normalizePhone($request->phone);

        $user = User::where('phone', $phone)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'phone' => 'No account found with this phone number.',
            ]);
        }

        $sent = $this->createAndSendOtp($phone);

        if (! $sent) {
            throw ValidationException::withMessages([
                'phone' => 'Could not send verification code. Please try again in a few minutes.',
            ]);
        }

        $request->session()->put('pwd_reset_phone', $phone);
        $request->session()->put('pwd_reset_expires_at', now()->addMinutes(5)->toIso8601String());

        return redirect()->route('password.otp.verify');
    }

    public function showVerify(Request $request): Response|RedirectResponse
    {
        $phone = $request->session()->get('pwd_reset_phone');

        if (! $phone) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/ForgotPasswordVerifyOtp', [
            'phone' => $phone,
            'expiresAt' => $request->session()->get('pwd_reset_expires_at'),
            'status' => session('status'),
        ]);
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'otp_code' => 'required|string|size:6',
        ]);

        $phone = $request->session()->get('pwd_reset_phone');

        if (! $phone) {
            return redirect()->route('password.request');
        }

        $otp = Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (! $otp) {
            throw ValidationException::withMessages([
                'otp_code' => 'No pending verification found. Please request a new OTP.',
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

        $request->session()->put('pwd_reset_verified', true);

        return redirect()->route('password.otp.reset');
    }

    public function resendOtp(Request $request): RedirectResponse
    {
        $phone = $request->session()->get('pwd_reset_phone');

        if (! $phone) {
            return redirect()->route('password.request');
        }

        $lastOtp = Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if ($lastOtp && ! $lastOtp->isExpired()) {
            throw ValidationException::withMessages([
                'otp_code' => 'Please wait before requesting a new OTP.',
            ]);
        }

        $sent = $this->createAndSendOtp($phone);

        if (! $sent) {
            throw ValidationException::withMessages([
                'otp_code' => 'Could not send verification code. Please try again in a few minutes.',
            ]);
        }

        $request->session()->put('pwd_reset_expires_at', now()->addMinutes(5)->toIso8601String());

        return back()->with('status', 'A new OTP has been sent to your phone.');
    }

    public function showReset(Request $request): Response|RedirectResponse
    {
        $phone = $request->session()->get('pwd_reset_phone');
        $verified = $request->session()->get('pwd_reset_verified');

        if (! $phone || ! $verified) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/ForgotPasswordReset', [
            'phone' => $phone,
        ]);
    }

    public function reset(Request $request): RedirectResponse
    {
        $phone = $request->session()->get('pwd_reset_phone');
        $verified = $request->session()->get('pwd_reset_verified');

        if (! $phone || ! $verified) {
            return redirect()->route('password.request');
        }

        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('phone', $phone)->firstOrFail();

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        $request->session()->forget(['pwd_reset_phone', 'pwd_reset_expires_at', 'pwd_reset_verified']);

        return redirect()->route('login')->with('status', 'Password reset successfully. Please sign in.');
    }

    private function createAndSendOtp(string $phone): bool
    {
        Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->delete();

        $otpCode = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(5);

        $sent = app(SmsService::class)->sendPasswordResetOtp($phone, $otpCode);

        if (! $sent) {
            return false;
        }

        Otp::create([
            'phone' => $phone,
            'otp_code' => $otpCode,
            'payload' => ['type' => 'password_reset'],
            'expires_at' => $expiresAt,
            'attempts' => 0,
        ]);

        return true;
    }
}
