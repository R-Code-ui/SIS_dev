<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Announcement::class);
        // Order by latest created first (newest announcements on top)
        $announcements = Announcement::with('publisher')
                                     ->latest()
                                     ->paginate(10);
        return inertia('Admin/Announcements/Index', ['announcements' => $announcements]);
    }

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
