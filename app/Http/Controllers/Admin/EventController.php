<?php

namespace App\Http\Controllers\Admin;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class EventController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Event::class);
        // Order by start_date descending (newest events first)
        $events = Event::with('creator')->latest('start_date')->paginate(10);
        return inertia('Admin/Events/Index', ['events' => $events]);
    }

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
