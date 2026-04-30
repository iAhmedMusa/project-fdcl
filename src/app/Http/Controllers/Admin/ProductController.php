<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::orderBy('sort_order')->orderBy('name');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'flag_emoji' => $product->flag_emoji,
                'category' => $product->category,
                'size_label' => $product->size_label,
                'price' => (float) $product->price,
                'copies_per_sheet' => $product->copies_per_sheet,
                'min_quantity' => $product->min_quantity,
                'quantity_step' => $product->quantity_step,
                'is_active' => $product->is_active,
                'sort_order' => $product->sort_order,
            ];
        })->values();

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
            'flag_emoji' => 'nullable|string|max:10',
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
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if (! isset($validated['sort_order'])) {
            $validated['sort_order'] = (Product::max('sort_order') ?? 0) + 1;
        }

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
                'flag_emoji' => $product->flag_emoji,
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
                'sort_order' => $product->sort_order,
            ],
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'flag_emoji' => 'nullable|string|max:10',
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
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->items as $item) {
                Product::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });

        return response()->json(['success' => true]);
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
