<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->student;
        if (!$student) abort(403, 'Student profile not found.');

        $query = Assignment::with(['subject', 'teacher.user'])
            ->where('class_id', $student->class_id)
            ->withExists(['submissions' => function ($q) use ($student) {
                $q->where('student_id', $student->id);
            }]);

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by subject
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        // Filter by status: pending (not submitted) or submitted
        if ($request->filled('status')) {
            if ($request->status === 'submitted') {
                $query->whereHas('submissions', fn($q) => $q->where('student_id', $student->id));
            } elseif ($request->status === 'pending') {
                $query->whereDoesntHave('submissions', fn($q) => $q->where('student_id', $student->id));
            }
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'due_asc': $query->orderBy('due_date', 'asc'); break;
            case 'due_desc': $query->orderBy('due_date', 'desc'); break;
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            default: $query->latest('assignments.created_at'); break;
        }

        $assignments = $query->paginate(10)->withQueryString();
        $subjects = Subject::all();

        return inertia('Student/Assignments/Index', [
            'assignments' => $assignments,
            'subjects' => $subjects,
            'filters' => [
                'search' => $request->search ?? '',
                'subject_id' => $request->subject_id ?? '',
                'status' => $request->status ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    public function show(Assignment $assignment)
    {
        $student = Auth::user()->student;
        if (!$student || $student->class_id !== $assignment->class_id) {
            abort(403);
        }

        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('student_id', $student->id)
            ->first();

        return inertia('Student/Assignments/Show', [
            'assignment' => $assignment->load('subject', 'teacher.user'),
            'submission' => $submission,
        ]);
    }

    public function store(Request $request, Assignment $assignment)
    {
        $student = Auth::user()->student;
        if (!$student || $student->class_id !== $assignment->class_id) {
            abort(403);
        }

        $validated = $request->validate([
            'submission_text' => 'nullable|string',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip,jpg,png',
        ]);

        $submission = AssignmentSubmission::firstOrNew([
            'assignment_id' => $assignment->id,
            'student_id' => $student->id,
        ]);

        $submission->submission_text = $validated['submission_text'] ?? null;
        if ($request->hasFile('file')) {
            if ($submission->file_path) {
                Storage::disk('public')->delete($submission->file_path);
            }
            $path = $request->file('file')->store('assignment_submissions', 'public');
            $submission->file_path = $path;
        }
        $submission->submitted_at = now();
        $submission->save();

        return redirect()->route('student.assignments.show', $assignment->id)
            ->with('success', 'Assignment submitted successfully.');
    }
}
