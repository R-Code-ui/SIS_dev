<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Announcement::class);

        $query = Announcement::with('publisher');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->filled('expired')) {
            if ($request->expired === 'active') {
                $query->where(function ($q) {
                    $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
                });
            } elseif ($request->expired === 'expired') {
                $query->whereNotNull('expiry_date')->where('expiry_date', '<', now());
            }
        }

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            default: $query->latest('announcements.created_at');
        }

        $announcements = $query->paginate(10)->withQueryString();

        return inertia('Admin/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => [
                'search' => $request->search ?? '',
                'expired' => $request->expired ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy unchanged
    public function create()
    {
        Gate::authorize('create', Announcement::class);
        return inertia('Admin/Announcements/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Announcement::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'expiry_date' => 'nullable|date|after:today',
        ]);
        $validated['published_by'] = Auth::id();
        Announcement::create($validated);
        return redirect()->route('admin.announcements.index')->with('success', 'Announcement created successfully.');
    }

    public function edit(Announcement $announcement)
    {
        Gate::authorize('update', $announcement);
        return inertia('Admin/Announcements/Edit', ['announcement' => $announcement]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        Gate::authorize('update', $announcement);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'expiry_date' => 'nullable|date|after:today',
        ]);
        $announcement->update($validated);
        return redirect()->route('admin.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        Gate::authorize('delete', $announcement);
        $announcement->delete();
        return redirect()->route('admin.announcements.index')->with('success', 'Announcement deleted successfully.');
    }
}
