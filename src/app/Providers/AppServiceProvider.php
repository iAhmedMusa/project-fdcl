<?php

namespace App\Providers;

use App\Events\OrderPlaced;
use App\Events\OrderStatusChanged;
use App\Listeners\SendInvoiceSmsOnOrderPlaced;
use App\Listeners\SendOrderConfirmationEmail;
use App\Listeners\SendStatusUpdateEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register event listeners
        Event::listen(
            OrderPlaced::class,
            SendOrderConfirmationEmail::class
        );

        Event::listen(
            OrderPlaced::class,
            SendInvoiceSmsOnOrderPlaced::class
        );

        Event::listen(
            OrderStatusChanged::class,
            SendStatusUpdateEmail::class
        );
    }
}
