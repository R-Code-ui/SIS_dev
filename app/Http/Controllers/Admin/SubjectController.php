<?php

namespace App\Http\Controllers\Admin;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SubjectController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Subject::class);
        $subjects = Subject::paginate(10);
        return inertia('Admin/Subjects/Index', ['subjects' => $subjects]);
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
