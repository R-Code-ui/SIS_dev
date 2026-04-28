<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Student;
use App\Models\Exam;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Result::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $myClassIds = $teacher->getMyClassIds();

        // Get exam IDs that belong to teacher's classes
        $examIds = Exam::whereIn('class_id', $myClassIds)->pluck('id');

        $query = Result::with(['student.user', 'exam', 'subject'])
            ->whereIn('exam_id', $examIds);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }

        $sort = $request->get('sort', 'student_name_asc');
        switch ($sort) {
            case 'student_name_asc':
                $query->join('students', 'results.student_id', '=', 'students.id')
                      ->join('users', 'students.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'asc')
                      ->select('results.*');
                break;
            case 'student_name_desc':
                $query->join('students', 'results.student_id', '=', 'students.id')
                      ->join('users', 'students.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'desc')
                      ->select('results.*');
                break;
            default: $query->latest();
        }

        $results = $query->paginate(10)->withQueryString();

        $exams = Exam::whereIn('class_id', $myClassIds)->get(['id', 'title']);

        return inertia('Teacher/Results/Index', [
            'results' => $results,
            'exams' => $exams,
            'filters' => $request->only(['search', 'exam_id', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Result::class);

        $teacher = Auth::user()->teacher;
        $myClassIds = $teacher->getMyClassIds();

        $exams = Exam::whereIn('class_id', $myClassIds)->get(['id', 'title']);
        $students = Student::with('user')->whereIn('class_id', $myClassIds)->get();
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Results/Create', [
            'exams' => $exams,
            'students' => $students,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Result::class);

        $teacher = Auth::user()->teacher;
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks_obtained' => 'required|integer|min:0',
            'grade' => 'nullable|string|max:2',
            'remarks' => 'nullable|string',
        ]);

        // Verify exam belongs to teacher's class
        $exam = Exam::find($validated['exam_id']);
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        Result::create($validated);
        return redirect()->route('teacher.results.index')->with('success', 'Result added.');
    }

    public function edit(Result $result)
    {
        $this->authorize('update', $result);

        $teacher = Auth::user()->teacher;
        $exam = $result->exam;
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        $myClassIds = $teacher->getMyClassIds();
        $exams = Exam::whereIn('class_id', $myClassIds)->get(['id', 'title']);
        $students = Student::with('user')->whereIn('class_id', $myClassIds)->get();
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Results/Edit', [
            'result' => $result,
            'exams' => $exams,
            'students' => $students,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, Result $result)
    {
        $this->authorize('update', $result);

        $teacher = Auth::user()->teacher;
        $exam = $result->exam;
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks_obtained' => 'required|integer|min:0',
            'grade' => 'nullable|string|max:2',
            'remarks' => 'nullable|string',
        ]);

        $result->update($validated);
        return redirect()->route('teacher.results.index')->with('success', 'Result updated.');
    }

    public function destroy(Result $result)
    {
        $this->authorize('delete', $result);

        $teacher = Auth::user()->teacher;
        $exam = $result->exam;
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        $result->delete();
        return redirect()->route('teacher.results.index')->with('success', 'Result deleted.');
    }
}
