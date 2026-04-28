<?php

namespace App\Http\Controllers\Admin;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SubjectController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Subject::class);

        $query = Subject::query();

        // Search by name or code
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'code_asc':
                $query->orderBy('code', 'asc');
                break;
            case 'code_desc':
                $query->orderBy('code', 'desc');
                break;
            case 'credits_asc':
                $query->orderBy('credits', 'asc');
                break;
            case 'credits_desc':
                $query->orderBy('credits', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('subjects.created_at'); // newest first
                break;
        }

        $subjects = $query->paginate(10)->withQueryString();

        return inertia('Admin/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => [
                'search' => $request->search ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Subject::class);
        return inertia('Admin/Subjects/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Subject::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:subjects',
            'credits' => 'nullable|integer|min:1|max:6',
            'description' => 'nullable|string',
        ]);

        Subject::create($validated);
        return redirect()->route('admin.subjects.index')->with('success', 'Subject created successfully.');
    }

    public function edit(Subject $subject)
    {
        Gate::authorize('update', $subject);
        return inertia('Admin/Subjects/Edit', ['subject' => $subject]);
    }

    public function update(Request $request, Subject $subject)
    {
        Gate::authorize('update', $subject);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:subjects,code,' . $subject->id,
            'credits' => 'nullable|integer|min:1|max:6',
            'description' => 'nullable|string',
        ]);

        $subject->update($validated);
        return redirect()->route('admin.subjects.index')->with('success', 'Subject updated successfully.');
    }

    public function destroy(Subject $subject)
    {
        Gate::authorize('delete', $subject);
        $subject->delete();
        return redirect()->route('admin.subjects.index')->with('success', 'Subject deleted successfully.');
    }
}
