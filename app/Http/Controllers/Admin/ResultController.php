<?php

namespace App\Http\Controllers\Admin;

use App\Models\Result;
use App\Models\Student;
use App\Models\Exam;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ResultController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Result::class);
        // Order by latest created first (newest results appear on top)
        $results = Result::with(['student.user', 'exam', 'subject'])
                         ->latest()
                         ->paginate(10);
        return inertia('Admin/Results/Index', ['results' => $results]);
    }

    public function create()
    {
        Gate::authorize('create', Result::class);
        $students = Student::with('user')->get();
        $exams = Exam::all();
        $subjects = Subject::all();
        return inertia('Admin/Results/Create', compact('students', 'exams', 'subjects'));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Result::class);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks_obtained' => 'required|integer|min:0',
            'grade' => 'nullable|string|max:2',
            'remarks' => 'nullable|string',
        ]);

        Result::create($validated);
        return redirect()->route('admin.results.index')->with('success', 'Result created successfully.');
    }

    public function edit(Result $result)
    {
        Gate::authorize('update', $result);
        $students = Student::with('user')->get();
        $exams = Exam::all();
        $subjects = Subject::all();
        return inertia('Admin/Results/Edit', compact('result', 'students', 'exams', 'subjects'));
    }

    public function update(Request $request, Result $result)
    {
        Gate::authorize('update', $result);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks_obtained' => 'required|integer|min:0',
            'grade' => 'nullable|string|max:2',
            'remarks' => 'nullable|string',
        ]);

        $result->update($validated);
        return redirect()->route('admin.results.index')->with('success', 'Result updated successfully.');
    }

    public function destroy(Result $result)
    {
        Gate::authorize('delete', $result);
        $result->delete();
        return redirect()->route('admin.results.index')->with('success', 'Result deleted successfully.');
    }
}
