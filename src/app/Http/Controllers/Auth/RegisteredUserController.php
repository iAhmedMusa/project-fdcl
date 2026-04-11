<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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

    /**
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $method = $request->input('method', 'email');

        if ($method === 'phone') {
            $request->validate([
                'name'     => 'required|string|max:255',
                'phone'    => 'required|string|max:20|unique:'.User::class,
                'address'  => 'nullable|string|max:500',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name'     => $request->name,
                'phone'    => $request->phone,
                'address'  => $request->address,
                'password' => Hash::make($request->password),
            ]);
        } else {
            $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'phone'    => 'nullable|string|max:20',
                'address'  => 'nullable|string|max:500',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'address'  => $request->address,
                'password' => Hash::make($request->password),
            ]);
        }

        $user->assignRole('customer');

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('customer.dashboard', absolute: false));
    }
}
