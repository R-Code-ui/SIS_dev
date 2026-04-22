<?php

namespace App\Http\Controllers\Admin;

use App\Models\Classes;
use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClassesController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Classes::class);
        $classes = Classes::withCount(['teachers', 'subjects'])->paginate(10);
        return inertia('Admin/Classes/Index', ['classes' => $classes]);
    }

    public function create()
    {
        Gate::authorize('create', Classes::class);
        $teachers = Teacher::with('user')->get();
        $subjects = Subject::all();
        return inertia('Admin/Classes/Create', [
            'teachers' => $teachers,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Classes::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'section' => 'nullable|string|max:10',
            'capacity' => 'nullable|integer|min:1|max:200',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:teachers,id',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $class = Classes::create($validated);

        if (!empty($validated['teacher_ids'])) {
            $class->teachers()->sync($validated['teacher_ids']);
        }
        if (!empty($validated['subject_ids'])) {
            $class->subjects()->sync($validated['subject_ids']);
        }

        return redirect()->route('admin.classes.index')->with('success', 'Class created successfully.');
    }

    public function edit(Classes $class)
    {
        Gate::authorize('update', $class);
        $teachers = Teacher::with('user')->get();
        $subjects = Subject::all();
        return inertia('Admin/Classes/Edit', [
            'class' => $class->load('teachers', 'subjects'),
            'teachers' => $teachers,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, Classes $class)
    {
        Gate::authorize('update', $class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'section' => 'nullable|string|max:10',
            'capacity' => 'nullable|integer|min:1|max:200',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:teachers,id',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $class->update($validated);

        $class->teachers()->sync($validated['teacher_ids'] ?? []);
        $class->subjects()->sync($validated['subject_ids'] ?? []);

        return redirect()->route('admin.classes.index')->with('success', 'Class updated successfully.');
    }

    public function destroy(Classes $class)
    {
        Gate::authorize('delete', $class);
        $class->delete();
        return redirect()->route('admin.classes.index')->with('success', 'Class deleted successfully.');
    }
}
