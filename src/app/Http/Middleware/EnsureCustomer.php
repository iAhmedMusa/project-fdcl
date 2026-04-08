<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user?->hasRole('customer')) {
            if ($user?->isAdmin()) {
                return redirect('/admin');
            }
            if ($user?->isStaff()) {
                return redirect('/staff');
            }
            abort(403);
        }

        return $next($request);
    }
}
