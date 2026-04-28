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
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Result::class);

        $query = Result::with(['student.user', 'exam', 'subject']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student.user', fn($u) => $u->where('name', 'like', "%{$search}%"));
        }

        if ($request->filled('exam_id')) $query->where('exam_id', $request->exam_id);
        if ($request->filled('subject_id')) $query->where('subject_id', $request->subject_id);
        if ($request->filled('student_id')) $query->where('student_id', $request->student_id);

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'marks_asc': $query->orderBy('marks_obtained', 'asc'); break;
            case 'marks_desc': $query->orderBy('marks_obtained', 'desc'); break;
            case 'student_asc':
                $query->join('students', 'results.student_id', '=', 'students.id')
                      ->join('users', 'students.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'asc')
                      ->select('results.*');
                break;
            case 'student_desc':
                $query->join('students', 'results.student_id', '=', 'students.id')
                      ->join('users', 'students.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'desc')
                      ->select('results.*');
                break;
            default: $query->latest('results.created_at');
        }

        $results = $query->paginate(10)->withQueryString();

        return inertia('Admin/Results/Index', [
            'results' => $results,
            'exams' => Exam::all(),
            'subjects' => Subject::all(),
            'students' => Student::with('user')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'exam_id' => $request->exam_id ?? '',
                'subject_id' => $request->subject_id ?? '',
                'student_id' => $request->student_id ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy unchanged
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
