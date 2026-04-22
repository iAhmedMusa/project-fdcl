<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\FrameController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MugController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReprintController;
use App\Http\Controllers\Staff\AppointmentController as StaffAppointmentController;
use App\Http\Controllers\Staff\CustomerController;
use App\Http\Controllers\Staff\OrderController;
use App\Http\Controllers\Staff\PaymentController;
use App\Http\Controllers\Staff\PhotoStorageController;
use App\Http\Controllers\Staff\WalkInOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Landing/Home');
});

// ─── Public booking ──────────────────────────────────────────────────────────
Route::get('/order/photo-studio', [AppointmentController::class, 'create'])->name('order.photo-studio');
Route::post('/order/photo-studio', [AppointmentController::class, 'store'])->name('order.photo-studio.store');

// ─── Public order pages (auth gate on submit) ───────────────────────────────
Route::get('/album', [AlbumController::class, 'index'])->name('public.album');
Route::get('/frame', [FrameController::class, 'index'])->name('public.frame');
Route::get('/mug', [MugController::class, 'index'])->name('public.mug');

// ─── Order flow (auth required) ─────────────────────────────────────────────

Route::middleware(['auth', 'customer'])->group(function () {
    // Service selection
    Route::get('/order', function () {
        return Inertia::render('Order/Services');
    })->name('order.create');

    // Photo Reprint
    Route::get('/order/reprint', [ReprintController::class, 'create'])->name('order.reprint');
    Route::post('/order/reprint', [ReprintController::class, 'store'])->name('order.reprint.store');

    // Photo Album
    Route::get('/order/album', [AlbumController::class, 'create'])->name('order.album');
    Route::post('/order/album', [AlbumController::class, 'store'])->name('order.album.store');

    // Photo Frame
    Route::get('/order/frame', [FrameController::class, 'create'])->name('order.frame');
    Route::post('/order/frame', [FrameController::class, 'store'])->name('order.frame.store');

    // Photo Mug
    Route::get('/order/mug', [MugController::class, 'create'])->name('order.mug');
    Route::post('/order/mug', [MugController::class, 'store'])->name('order.mug.store');
});

// Invoice download (auth required)
Route::get('/orders/{order}/invoice', [InvoiceController::class, 'download'])->middleware('auth')->name('orders.invoice');

// Public invoice routes — token-based, no auth required
Route::get('/i/{token}', [InvoiceController::class, 'showPublic'])->name('invoice.public');
Route::get('/i/{token}/pdf', [InvoiceController::class, 'downloadPublic'])->name('invoice.public.pdf');

// Customer routes
Route::middleware(['auth', 'customer'])->prefix('dashboard')->group(function () {
    Route::get('/', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
    Route::get('/orders/{orderNumber}', [CustomerDashboardController::class, 'show'])->name('customer.orders.show');
});

// Staff routes
Route::middleware(['auth', 'staff'])->prefix('staff')->group(function () {
    Route::get('/', [OrderController::class, 'index'])->name('staff.dashboard');
    // Walk-in order creation — must be before {orderNumber} wildcard
    Route::get('/orders/create', [WalkInOrderController::class, 'create'])->name('staff.orders.create');
    Route::get('/orders/{order}/edit', [WalkInOrderController::class, 'edit'])->name('staff.orders.edit');
    Route::post('/orders', [WalkInOrderController::class, 'store'])->name('staff.orders.store');
    Route::put('/orders/{order}', [WalkInOrderController::class, 'update'])->name('staff.orders.update');
    // Customer search (JSON) — must be before {customer} wildcard
    Route::get('/customers/search', [WalkInOrderController::class, 'searchCustomers'])->name('staff.customers.search');
    Route::get('/customers/{customer}/photo-registries', [WalkInOrderController::class, 'getCustomerPhotoRegistries'])->name('staff.customers.photo-registries');
    // Customer management
    Route::get('/customers', [CustomerController::class, 'index'])->name('staff.customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('staff.customers.show');
    Route::patch('/customers/{customer}', [CustomerController::class, 'update'])->name('staff.customers.update');
    Route::post('/customers/{customer}/enable-login', [CustomerController::class, 'enableLogin'])->name('staff.customers.enable-login');
    Route::post('/customers/{customer}/reset-password', [CustomerController::class, 'resetPassword'])->name('staff.customers.reset-password');
    Route::patch('/customers/{customer}/toggle-active', [CustomerController::class, 'toggleActive'])->name('staff.customers.toggle-active');
    // Existing order routes
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show'])->name('staff.orders.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('staff.orders.status');
    Route::patch('/orders/{order}/notes', [OrderController::class, 'updateNotes'])->name('staff.orders.notes');
    Route::post('/orders/{order}/photos', [OrderController::class, 'uploadPhoto'])->name('staff.orders.photos');
    Route::post('/orders/{order}/payments', [PaymentController::class, 'store'])->name('staff.orders.payments');
    Route::post('/orders/{order}/send-invoice-sms', [InvoiceController::class, 'sendSms'])->name('staff.orders.invoice-sms');
    Route::post('/orders/{order}/send-ready-sms', [InvoiceController::class, 'sendReadySms'])->name('staff.orders.ready-sms');
    // Appointments
    Route::get('/appointments', [StaffAppointmentController::class, 'index'])->name('staff.appointments.index');
    Route::patch('/appointments/{appointment}/status', [StaffAppointmentController::class, 'updateStatus'])->name('staff.appointments.status');
    // Photo Storage
    Route::get('/photos', [PhotoStorageController::class, 'index'])->name('staff.photos.index');
    Route::get('/photos/download', [PhotoStorageController::class, 'download'])->name('staff.photos.download');
    Route::get('/photos/{code}', [PhotoStorageController::class, 'show'])->name('staff.photos.show');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/sms-balance', [DashboardController::class, 'smsBalance'])->name('admin.sms-balance');

    // Orders
    Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/orders/{orderNumber}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('admin.orders.show');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('admin.products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::patch('/products/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('admin.products.toggle-active');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('admin.users.toggle-active');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports.index');
    Route::get('/reports/download', [ReportController::class, 'download'])->name('admin.reports.download');
});

// Authenticated routes (all roles)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile/phone/send-otp', [ProfileController::class, 'sendPhoneOtp'])->name('profile.phone.send-otp');
    Route::post('/profile/phone/verify-otp', [ProfileController::class, 'verifyPhoneOtp'])->name('profile.phone.verify-otp');

    // Photo registry lookup (used by customers and staff)
    Route::post('/reprint/lookup', [ReprintController::class, 'lookup'])->name('reprint.lookup');
});

require __DIR__.'/auth.php';
