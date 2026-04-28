<?php

namespace App\Http\Controllers\Admin;

use App\Models\Lesson;
use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LessonController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Lesson::class);

        $query = Lesson::with(['class', 'subject', 'teacher.user']);

        // Search by title, class name, subject name, teacher name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('class', fn($c) => $c->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('subject', fn($s) => $s->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('teacher.user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        // Filter by class
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        // Filter by subject
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            case 'date_asc': $query->orderBy('date', 'asc'); break;
            case 'date_desc': $query->orderBy('date', 'desc'); break;
            case 'class_asc':
                $query->join('classes', 'lessons.class_id', '=', 'classes.id')
                      ->orderBy('classes.name', 'asc')
                      ->select('lessons.*');
                break;
            case 'class_desc':
                $query->join('classes', 'lessons.class_id', '=', 'classes.id')
                      ->orderBy('classes.name', 'desc')
                      ->select('lessons.*');
                break;
            case 'latest':
            default:
                $query->latest('lessons.created_at');
                break;
        }

        $lessons = $query->paginate(10)->withQueryString();

        $classes = Classes::all();
        $subjects = Subject::all();

        return inertia('Admin/Lessons/Index', [
            'lessons' => $lessons,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => [
                'search' => $request->search ?? '',
                'class_id' => $request->class_id ?? '',
                'subject_id' => $request->subject_id ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy remain EXACTLY as in your original code
    public function create()
    {
        Gate::authorize('create', Lesson::class);
        $classes = Classes::all();
        $subjects = Subject::all();
        $teachers = Teacher::with('user')->get();
        return inertia('Admin/Lessons/Create', compact('classes', 'subjects', 'teachers'));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Lesson::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'materials' => 'nullable|string',
        ]);
        Lesson::create($validated);
        return redirect()->route('admin.lessons.index')->with('success', 'Lesson created successfully.');
    }

    public function edit(Lesson $lesson)
    {
        Gate::authorize('update', $lesson);
        $classes = Classes::all();
        $subjects = Subject::all();
        $teachers = Teacher::with('user')->get();
        return inertia('Admin/Lessons/Edit', compact('lesson', 'classes', 'subjects', 'teachers'));
    }

    public function update(Request $request, Lesson $lesson)
    {
        Gate::authorize('update', $lesson);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'materials' => 'nullable|string',
        ]);
        $lesson->update($validated);
        return redirect()->route('admin.lessons.index')->with('success', 'Lesson updated successfully.');
    }

    public function destroy(Lesson $lesson)
    {
        Gate::authorize('delete', $lesson);
        $lesson->delete();
        return redirect()->route('admin.lessons.index')->with('success', 'Lesson deleted successfully.');
    }
}
