<?php

namespace App\Http\Controllers\Admin;

use App\Models\Exam;
use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ExamController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Exam::class);
        $exams = Exam::with(['class', 'subject'])->paginate(10);
        return inertia('Admin/Exams/Index', ['exams' => $exams]);
    }

    public function create()
    {
        Gate::authorize('create', Exam::class);
        $classes = Classes::all();
        $subjects = Subject::all();
        return inertia('Admin/Exams/Create', compact('classes', 'subjects'));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Exam::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'max_marks' => 'required|integer|min:1',
            'passing_marks' => 'required|integer|min:0|lte:max_marks',
        ]);

        Exam::create($validated);
        return redirect()->route('admin.exams.index')->with('success', 'Exam created successfully.');
    }

    public function edit(Exam $exam)
    {
        Gate::authorize('update', $exam);
        $classes = Classes::all();
        $subjects = Subject::all();
        return inertia('Admin/Exams/Edit', compact('exam', 'classes', 'subjects'));
    }

    public function update(Request $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'max_marks' => 'required|integer|min:1',
            'passing_marks' => 'required|integer|min:0|lte:max_marks',
        ]);

        $exam->update($validated);
        return redirect()->route('admin.exams.index')->with('success', 'Exam updated successfully.');
    }

    public function destroy(Exam $exam)
    {
        Gate::authorize('delete', $exam);
        $exam->delete();
        return redirect()->route('admin.exams.index')->with('success', 'Exam deleted successfully.');
    }
}
