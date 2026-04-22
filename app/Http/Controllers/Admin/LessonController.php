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
    public function index()
    {
        Gate::authorize('viewAny', Lesson::class);
        // Eager load teacher.user to get teacher's name
        $lessons = Lesson::with(['class', 'subject', 'teacher.user'])->paginate(10);
        return inertia('Admin/Lessons/Index', ['lessons' => $lessons]);
    }

    public function create()
    {
        Gate::authorize('create', Lesson::class);
        $classes = Classes::all();
        $subjects = Subject::all();
        // Eager load user to get teacher names
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
        // Eager load user to get teacher names
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
