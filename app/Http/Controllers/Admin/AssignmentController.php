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
    public function index()
    {
        Gate::authorize('viewAny', Assignment::class);
        // Eager load teacher.user to get teacher's name
        $assignments = Assignment::with(['class', 'subject', 'teacher.user'])->paginate(10);
        return inertia('Admin/Assignments/Index', ['assignments' => $assignments]);
    }

    public function create()
    {
        Gate::authorize('create', Assignment::class);
        $classes = Classes::all();
        $subjects = Subject::all();
        // Eager load user to get teacher names in dropdown
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
        // Eager load user to get teacher names in dropdown
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
