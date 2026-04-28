<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Lesson::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $myClassIds = $teacher->getMyClassIds();

        $query = Lesson::with(['class', 'subject', 'teacher'])
            ->whereIn('class_id', $myClassIds)
            ->where('teacher_id', $teacher->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('class_id') && in_array($request->class_id, $myClassIds)) {
            $query->where('class_id', $request->class_id);
        }

        $sort = $request->get('sort', 'date_desc');
        switch ($sort) {
            case 'date_asc': $query->orderBy('date', 'asc'); break;
            case 'date_desc': $query->orderBy('date', 'desc'); break;
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            default: $query->orderBy('date', 'desc');
        }

        $lessons = $query->paginate(10)->withQueryString();

        $classes = $teacher->classes()->get(['id', 'name']);

        return inertia('Teacher/Lessons/Index', [
            'lessons' => $lessons,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Lesson::class);

        $teacher = Auth::user()->teacher;
        $classes = $teacher->classes()->get(['id', 'name']);
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Lessons/Create', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Lesson::class);

        $teacher = Auth::user()->teacher;
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'materials' => 'nullable|string',
        ]);

        // Ensure class belongs to this teacher
        if (!$teacher->isMyClass($validated['class_id'])) {
            abort(403, 'You do not own this class.');
        }

        $validated['teacher_id'] = $teacher->id;
        Lesson::create($validated);

        return redirect()->route('teacher.lessons.index')->with('success', 'Lesson created.');
    }

    public function edit(Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        $teacher = Auth::user()->teacher;
        if ($lesson->teacher_id !== $teacher->id) abort(403);

        $classes = $teacher->classes()->get(['id', 'name']);
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Lessons/Edit', [
            'lesson' => $lesson,
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        $teacher = Auth::user()->teacher;
        if ($lesson->teacher_id !== $teacher->id) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'materials' => 'nullable|string',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        $lesson->update($validated);
        return redirect()->route('teacher.lessons.index')->with('success', 'Lesson updated.');
    }

    public function destroy(Lesson $lesson)
    {
        $this->authorize('delete', $lesson);

        $teacher = Auth::user()->teacher;
        if ($lesson->teacher_id !== $teacher->id) abort(403);

        $lesson->delete();
        return redirect()->route('teacher.lessons.index')->with('success', 'Lesson deleted.');
    }
}
