<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::orderBy('category')->orderBy('name');

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->paginate(20)->through(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'size_label' => $product->size_label,
                'price' => (float) $product->price,
                'copies_per_sheet' => $product->copies_per_sheet,
                'min_quantity' => $product->min_quantity,
                'quantity_step' => $product->quantity_step,
                'is_active' => $product->is_active,
            ];
        });

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['category', 'is_active', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:photo_studio,reprint,album,frame,mug,print',
            'size_label' => 'required|string|max:50',
            'width_mm' => 'nullable|numeric|min:1',
            'height_mm' => 'nullable|numeric|min:1',
            'price' => 'required|numeric|min:0',
            'copies_per_sheet' => 'required|integer|min:1',
            'min_quantity' => 'required|integer|min:1',
            'quantity_step' => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'size_label' => $product->size_label,
                'width_mm' => $product->width_mm,
                'height_mm' => $product->height_mm,
                'price' => $product->price,
                'copies_per_sheet' => $product->copies_per_sheet,
                'min_quantity' => $product->min_quantity,
                'quantity_step' => $product->quantity_step,
                'description' => $product->description,
                'is_active' => $product->is_active,
            ],
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:photo_studio,reprint,album,frame,mug,print',
            'size_label' => 'required|string|max:50',
            'width_mm' => 'nullable|numeric|min:1',
            'height_mm' => 'nullable|numeric|min:1',
            'price' => 'required|numeric|min:0',
            'copies_per_sheet' => 'required|integer|min:1',
            'min_quantity' => 'required|integer|min:1',
            'quantity_step' => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function toggleActive(Product $product): RedirectResponse
    {
        $product->is_active = ! $product->is_active;
        $product->save();

        $status = $product->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Product {$status} successfully.");
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }
}
