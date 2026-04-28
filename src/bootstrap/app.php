<?php

use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureCustomer;
use App\Http\Middleware\EnsureStaff;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');

        $middleware->validateCsrfTokens(except: [
            'webhooks/pathao',
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => EnsureAdmin::class,
            'staff' => EnsureStaff::class,
            'customer' => EnsureCustomer::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Throwable $e, $request) {
            if ($e instanceof AuthenticationException) {
                if ($request->expectsJson()) {
                    return response()->json(['message' => 'Unauthenticated'], 401);
                }
                return redirect('/login');
            }

            if (! $request->header('X-Inertia')) {
                return null;
            }

            $message = match (true) {
                $e instanceof ModelNotFoundException => 'Record not found.',

                $e instanceof AuthorizationException => "Permission denied: {$e->getMessage()}",

                $e instanceof QueryException => (function () use ($e) {
                    $code = $e->getCode();
                    $msg  = $e->getMessage();

                    if ($code === '23000') {
                        // Duplicate entry
                        if (preg_match("/Duplicate entry '(.+?)' for key '(.+?)'/", $msg, $m)) {
                            $field = preg_replace('/^.+\./', '', $m[2]); // strip table prefix
                            $field = str_replace(['_unique', '_'], ['', ' '], $field);
                            return "Duplicate value: '{$m[1]}' already exists for {$field}.";
                        }
                        // Foreign key
                        if (str_contains($msg, 'FOREIGN KEY')) {
                            return 'Related record not found or still in use (foreign key constraint).';
                        }
                        return 'Integrity constraint violation.';
                    }

                    // Surface a short DB message without the full stack
                    preg_match('/SQLSTATE\[.+?\]: (.+?) \(/', $msg, $m);
                    $short = $m[1] ?? 'Database error.';

                    return "DB error: {$short}";
                })(),

                default => sprintf('%s: %s', class_basename($e), $e->getMessage()),
            };

            return back()->with('error', $message);
        });
    })->create();
