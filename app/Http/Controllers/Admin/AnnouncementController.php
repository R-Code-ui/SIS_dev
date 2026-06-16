<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
use App\Models\AnnouncementTarget;
use App\Models\Classes;
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

    public function create()
    {
        Gate::authorize('create', Announcement::class);
        $roles = ['admin', 'teacher', 'student', 'guardian'];
        $classes = Classes::all();
        return inertia('Admin/Announcements/Create', compact('roles', 'classes'));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Announcement::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'expiry_date' => 'nullable|date|after:today',
            'target_type' => 'required|in:all,role,class',
            'target_roles' => 'required_if:target_type,role|array|nullable',
            'target_roles.*' => 'string|in:admin,teacher,student,guardian',
            'target_class_ids' => 'required_if:target_type,class|array|nullable',
            'target_class_ids.*' => 'exists:classes,id',
        ]);

        $validated['published_by'] = Auth::id();
        $announcement = Announcement::create($validated);

        // Save targeting rules
        $this->saveTargets($announcement, $request);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement created successfully.');
    }

    public function edit(Announcement $announcement)
    {
        Gate::authorize('update', $announcement);
        $roles = ['admin', 'teacher', 'student', 'guardian'];
        $classes = Classes::all();
        $targets = $announcement->targets;
        return inertia('Admin/Announcements/Edit', compact('announcement', 'roles', 'classes', 'targets'));
    }

    public function update(Request $request, Announcement $announcement)
    {
        Gate::authorize('update', $announcement);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'expiry_date' => 'nullable|date|after:today',
            'target_type' => 'required|in:all,role,class',
            'target_roles' => 'required_if:target_type,role|array|nullable',
            'target_roles.*' => 'string|in:admin,teacher,student,guardian',
            'target_class_ids' => 'required_if:target_type,class|array|nullable',
            'target_class_ids.*' => 'exists:classes,id',
        ]);

        $announcement->update($validated);
        $this->saveTargets($announcement, $request);

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        Gate::authorize('delete', $announcement);
        $announcement->delete();
        return redirect()->route('admin.announcements.index')->with('success', 'Announcement deleted successfully.');
    }

    // Helper to save targeting rules
    private function saveTargets($announcement, $request)
    {
        // Remove existing targets
        $announcement->targets()->delete();

        if ($request->target_type === 'all') {
            $announcement->targets()->create([
                'target_type' => 'all',
                'target_role' => null,
                'target_class_id' => null,
            ]);
        } elseif ($request->target_type === 'role') {
            foreach ($request->target_roles as $role) {
                $announcement->targets()->create([
                    'target_type' => 'role',
                    'target_role' => $role,
                    'target_class_id' => null,
                ]);
            }
        } elseif ($request->target_type === 'class') {
            foreach ($request->target_class_ids as $classId) {
                $announcement->targets()->create([
                    'target_type' => 'class',
                    'target_role' => null,
                    'target_class_id' => $classId,
                ]);
            }
        }
    }
}
