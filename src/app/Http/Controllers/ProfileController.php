<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Otp;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (array_key_exists('phone', $validated) && $validated['phone'] !== $request->user()->phone) {
            unset($validated['phone']);
        }

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

public function sendPhoneOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'max:20', 'regex:/^(\+8801|8801|01)[3-9]\d{8}$/'],
        ]);

        $phone = User::normalizePhone($request->phone);

        $existingUser = User::where('phone', $phone)
            ->where('id', '!=', $request->user()->id)
            ->first();

        if ($existingUser) {
            throw ValidationException::withMessages([
                'phone' => 'This phone number is already in use by another account.',
            ]);
        }

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
            'payload' => [
                'type' => 'phone_update',
                'user_id' => $request->user()->id,
                'phone' => $phone,
            ],
            'expires_at' => $expiresAt,
            'attempts' => 0,
        ]);

        app(SmsService::class)->sendOtp($phone, $otpCode);

        $request->session()->put('profile_otp_phone', $phone);
        $request->session()->put('profile_otp_expires_at', $expiresAt->toIso8601String());

        return response()->json([
            'message' => 'OTP sent to ' . $phone,
            'phone' => $phone,
        ]);
    }

    public function verifyPhoneOtp(Request $request): JsonResponse
    {
        $request->validate([
            'otp_code' => 'required|string|size:6',
            'phone' => 'required|string|max:20',
        ]);

        $phone = User::normalizePhone($request->phone);

        $otp = Otp::where('phone', $phone)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (! $otp) {
            throw ValidationException::withMessages([
                'otp_code' => 'No pending verification found. Please try again.',
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

        $payload = $otp->payload;

        if (($payload['type'] ?? '') !== 'phone_update') {
            throw ValidationException::withMessages([
                'otp_code' => 'Invalid verification. Please try again.',
            ]);
        }

        $user = User::find($payload['user_id']);

        if (! $user || $user->id !== $request->user()->id) {
            throw ValidationException::withMessages([
                'otp_code' => 'Invalid verification. Please try again.',
            ]);
        }

        $otp->update(['verified_at' => now()]);

        $user->update(['phone' => $payload['phone']]);

        $request->session()->forget(['profile_otp_phone', 'profile_otp_expires_at']);

        return response()->json([
            'message' => 'Phone number verified successfully.',
            'phone' => $payload['phone'],
        ]);
    }
}