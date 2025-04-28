<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use App\Events\ItemCreated;
use App\Events\ItemStatusUpdated;
class ItemController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Item::class);

        $query = Item::query();

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Item::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $item = Item::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'status' => $validated['status'] ?? 'active',
            'owner_id' => auth()->id(),
        ]);

        event(new ItemCreated($item));

        return response()->json($item, 201);
    }

    public function show(Item $item)
    {
        $this->authorize('view', $item);

        $item->load('owner');
        return $item;
    }

    public function update(Request $request, Item $item)
    {
        $this->authorize('update', $item);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $statusChanged = isset($validated['status']) && $validated['status'] !== $item->status;
        $item->update($validated);

        if ($statusChanged) {
            event(new ItemStatusUpdated($item));
        }

        return $item;
    }

    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);

        $item->delete();
        return response()->json(null, 204);
    }
}
