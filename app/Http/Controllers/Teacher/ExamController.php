<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Exam::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $myClassIds = $teacher->getMyClassIds();

        $query = Exam::with(['class', 'subject'])
            ->whereIn('class_id', $myClassIds);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('class_id') && in_array($request->class_id, $myClassIds)) {
            $query->where('class_id', $request->class_id);
        }

        $sort = $request->get('sort', 'date_asc');
        switch ($sort) {
            case 'date_asc': $query->orderBy('date', 'asc'); break;
            case 'date_desc': $query->orderBy('date', 'desc'); break;
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            default: $query->orderBy('date', 'asc');
        }

        $exams = $query->paginate(10)->withQueryString();

        $classes = $teacher->classes()->get(['id', 'name']);

        return inertia('Teacher/Exams/Index', [
            'exams' => $exams,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Exam::class);

        $teacher = Auth::user()->teacher;
        $classes = $teacher->classes()->get(['id', 'name']);
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Exams/Create', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Exam::class);

        $teacher = Auth::user()->teacher;
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'max_marks' => 'required|integer|min:1',
            'passing_marks' => 'required|integer|min:0|lte:max_marks',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        Exam::create($validated);
        return redirect()->route('teacher.exams.index')->with('success', 'Exam created.');
    }

    public function edit(Exam $exam)
    {
        $this->authorize('update', $exam);

        $teacher = Auth::user()->teacher;
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        $classes = $teacher->classes()->get(['id', 'name']);
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Exams/Edit', [
            'exam' => $exam,
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $this->authorize('update', $exam);

        $teacher = Auth::user()->teacher;
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'max_marks' => 'required|integer|min:1',
            'passing_marks' => 'required|integer|min:0|lte:max_marks',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        $exam->update($validated);
        return redirect()->route('teacher.exams.index')->with('success', 'Exam updated.');
    }

    public function destroy(Exam $exam)
    {
        $this->authorize('delete', $exam);

        $teacher = Auth::user()->teacher;
        if (!$teacher->isMyClass($exam->class_id)) abort(403);

        $exam->delete();
        return redirect()->route('teacher.exams.index')->with('success', 'Exam deleted.');
    }
}
