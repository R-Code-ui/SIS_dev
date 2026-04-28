<?php

namespace App\Http\Controllers\Admin;

use App\Models\Assignment;
use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssignmentController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Assignment::class);

        $query = Assignment::with(['class', 'subject', 'teacher.user']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('class', fn($c) => $c->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('subject', fn($s) => $s->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('teacher.user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('class_id')) $query->where('class_id', $request->class_id);
        if ($request->filled('subject_id')) $query->where('subject_id', $request->subject_id);
        if ($request->filled('teacher_id')) $query->where('teacher_id', $request->teacher_id);

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            case 'due_date_asc': $query->orderBy('due_date', 'asc'); break;
            case 'due_date_desc': $query->orderBy('due_date', 'desc'); break;
            default: $query->latest('assignments.created_at');
        }

        $assignments = $query->paginate(10)->withQueryString();

        return inertia('Admin/Assignments/Index', [
            'assignments' => $assignments,
            'classes' => Classes::all(),
            'subjects' => Subject::all(),
            'teachers' => Teacher::with('user')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'class_id' => $request->class_id ?? '',
                'subject_id' => $request->subject_id ?? '',
                'teacher_id' => $request->teacher_id ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy unchanged
    public function create()
    {
        Gate::authorize('create', Assignment::class);
        $classes = Classes::all();
        $subjects = Subject::all();
        $teachers = Teacher::with('user')->get();
        return inertia('Admin/Assignments/Create', compact('classes', 'subjects', 'teachers'));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Assignment::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'due_date' => 'required|date',
            'file_path' => 'nullable|string',
        ]);
        Assignment::create($validated);
        return redirect()->route('admin.assignments.index')->with('success', 'Assignment created successfully.');
    }

    public function edit(Assignment $assignment)
    {
        Gate::authorize('update', $assignment);
        $classes = Classes::all();
        $subjects = Subject::all();
        $teachers = Teacher::with('user')->get();
        return inertia('Admin/Assignments/Edit', compact('assignment', 'classes', 'subjects', 'teachers'));
    }

    public function update(Request $request, Assignment $assignment)
    {
        Gate::authorize('update', $assignment);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'due_date' => 'required|date',
            'file_path' => 'nullable|string',
        ]);
        $assignment->update($validated);
        return redirect()->route('admin.assignments.index')->with('success', 'Assignment updated successfully.');
    }

    public function destroy(Assignment $assignment)
    {
        Gate::authorize('delete', $assignment);
        $assignment->delete();
        return redirect()->route('admin.assignments.index')->with('success', 'Assignment deleted successfully.');
    }
}
