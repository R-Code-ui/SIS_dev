<?php

namespace App\Http\Controllers\Admin;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class EventController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Event::class);

        $query = Event::with('creator');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('venue')) {
            $query->where('venue', $request->venue);
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('start_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('end_date', '<=', $request->date_to);
        }

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            case 'start_date_asc': $query->orderBy('start_date', 'asc'); break;
            case 'start_date_desc': $query->orderBy('start_date', 'desc'); break;
            default: $query->latest('events.created_at');
        }

        $events = $query->paginate(10)->withQueryString();

        $venues = Event::select('venue')->distinct()->whereNotNull('venue')->pluck('venue');

        return inertia('Admin/Events/Index', [
            'events' => $events,
            'venues' => $venues,
            'filters' => [
                'search' => $request->search ?? '',
                'venue' => $request->venue ?? '',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy unchanged
    public function create()
    {
        Gate::authorize('create', Event::class);
        return inertia('Admin/Events/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Event::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'venue' => 'nullable|string',
        ]);
        $validated['created_by'] = Auth::id();
        Event::create($validated);
        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function edit(Event $event)
    {
        Gate::authorize('update', $event);
        return inertia('Admin/Events/Edit', ['event' => $event]);
    }

    public function update(Request $request, Event $event)
    {
        Gate::authorize('update', $event);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'venue' => 'nullable|string',
        ]);
        $event->update($validated);
        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        Gate::authorize('delete', $event);
        $event->delete();
        return redirect()->route('admin.events.index')->with('success', 'Event deleted successfully.');
    }
}
