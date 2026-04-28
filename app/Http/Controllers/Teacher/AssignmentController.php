<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Assignment::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $myClassIds = $teacher->getMyClassIds();

        $query = Assignment::with(['class', 'subject'])
            ->whereIn('class_id', $myClassIds)
            ->where('teacher_id', $teacher->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('class_id') && in_array($request->class_id, $myClassIds)) {
            $query->where('class_id', $request->class_id);
        }

        $sort = $request->get('sort', 'due_date_asc');
        switch ($sort) {
            case 'due_date_asc': $query->orderBy('due_date', 'asc'); break;
            case 'due_date_desc': $query->orderBy('due_date', 'desc'); break;
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            default: $query->orderBy('due_date', 'asc');
        }

        $assignments = $query->paginate(10)->withQueryString();

        $classes = $teacher->classes()->get(['id', 'name']);

        return inertia('Teacher/Assignments/Index', [
            'assignments' => $assignments,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Assignment::class);

        $teacher = Auth::user()->teacher;
        $classes = $teacher->classes()->get(['id', 'name']);
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Assignments/Create', [
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Assignment::class);

        $teacher = Auth::user()->teacher;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'due_date' => 'required|date',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        $validated['teacher_id'] = $teacher->id;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('assignments', 'public');
            $validated['file_path'] = $path;
        }

        Assignment::create($validated);

        return redirect()->route('teacher.assignments.index')->with('success', 'Assignment created.');
    }

    public function edit(Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $teacher = Auth::user()->teacher;
        if ($assignment->teacher_id !== $teacher->id) abort(403);

        $classes = $teacher->classes()->get(['id', 'name']);
        $subjects = Subject::whereIn('id', $teacher->getMySubjectIds())->get();

        return inertia('Teacher/Assignments/Edit', [
            'assignment' => $assignment,
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, Assignment $assignment)
    {
        $this->authorize('update', $assignment);

        $teacher = Auth::user()->teacher;
        if ($assignment->teacher_id !== $teacher->id) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'due_date' => 'required|date',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($assignment->file_path) {
                Storage::disk('public')->delete($assignment->file_path);
            }
            $path = $request->file('file')->store('assignments', 'public');
            $validated['file_path'] = $path;
        } else {
            $validated['file_path'] = $assignment->file_path;
        }

        $assignment->update($validated);
        return redirect()->route('teacher.assignments.index')->with('success', 'Assignment updated.');
    }

    public function destroy(Assignment $assignment)
    {
        $this->authorize('delete', $assignment);

        $teacher = Auth::user()->teacher;
        if ($assignment->teacher_id !== $teacher->id) abort(403);

        if ($assignment->file_path) {
            Storage::disk('public')->delete($assignment->file_path);
        }
        $assignment->delete();

        return redirect()->route('teacher.assignments.index')->with('success', 'Assignment deleted.');
    }
}
