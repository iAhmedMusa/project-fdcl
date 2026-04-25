<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->getId())->first();

        if (! $user) {
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                $user->update(['google_id' => $googleUser->getId()]);
            } else {
                $user = User::create([
                    'name'     => $googleUser->getName(),
                    'email'    => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                ]);

                $user->assignRole('customer');
                event(new Registered($user));
            }
        }

        if (! $user->is_active) {
            return redirect()->route('login')->withErrors([
                'login' => trans('auth.failed'),
            ]);
        }

        Auth::login($user, remember: true);

        $request->session()->regenerate();

        return redirect(route('customer.dashboard'));
    }
}
