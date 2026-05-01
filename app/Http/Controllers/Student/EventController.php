<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('creator')
            ->where('start_date', '>=', now()); // only upcoming events

        // Search by title or venue
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        // Filter by venue (distinct venues from upcoming events)
        if ($request->filled('venue')) {
            $query->where('venue', $request->venue);
        }

        // Sorting
        $sort = $request->get('sort', 'start_date_asc');
        switch ($sort) {
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            case 'start_date_desc': $query->orderBy('start_date', 'desc'); break;
            default: $query->orderBy('start_date', 'asc'); // earliest first
        }

        $events = $query->paginate(10)->withQueryString();

        // Get distinct venues for filter dropdown (from upcoming events only)
        $venues = Event::where('start_date', '>=', now())
            ->distinct()
            ->pluck('venue')
            ->filter()
            ->values();

        return inertia('Student/Events/Index', [
            'events' => $events,
            'venues' => $venues,
            'filters' => [
                'search' => $request->search ?? '',
                'venue' => $request->venue ?? '',
                'sort' => $request->sort ?? 'start_date_asc',
            ],
        ]);
    }
}
