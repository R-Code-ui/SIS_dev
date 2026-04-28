<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Event::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $query = Event::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%");
        }

        $sort = $request->get('sort', 'start_date_asc');
        switch ($sort) {
            case 'start_date_asc': $query->orderBy('start_date', 'asc'); break;
            case 'start_date_desc': $query->orderBy('start_date', 'desc'); break;
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            default: $query->orderBy('start_date', 'asc');
        }

        $events = $query->paginate(10)->withQueryString();

        return inertia('Teacher/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }

    public function show(Event $event)
    {
        $this->authorize('view', $event);
        return inertia('Teacher/Events/Show', ['event' => $event]);
    }
}
