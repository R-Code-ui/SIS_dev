<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Announcement::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $query = Announcement::with('publisher');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'latest': $query->orderBy('created_at', 'desc'); break;
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            default: $query->orderBy('created_at', 'desc');
        }

        $announcements = $query->paginate(10)->withQueryString();

        return inertia('Teacher/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }

    public function show(Announcement $announcement)
    {
        $this->authorize('view', $announcement);
        return inertia('Teacher/Announcements/Show', ['announcement' => $announcement->load('publisher')]);
    }
}
