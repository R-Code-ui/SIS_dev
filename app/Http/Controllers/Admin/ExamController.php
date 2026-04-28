<?php

namespace App\Http\Controllers\Admin;

use App\Models\Exam;
use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ExamController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Exam::class);

        $query = Exam::with(['class', 'subject']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('class', fn($c) => $c->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('subject', fn($s) => $s->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('class_id')) $query->where('class_id', $request->class_id);
        if ($request->filled('subject_id')) $query->where('subject_id', $request->subject_id);

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'title_asc': $query->orderBy('title', 'asc'); break;
            case 'title_desc': $query->orderBy('title', 'desc'); break;
            case 'date_asc': $query->orderBy('date', 'asc'); break;
            case 'date_desc': $query->orderBy('date', 'desc'); break;
            case 'max_marks_asc': $query->orderBy('max_marks', 'asc'); break;
            case 'max_marks_desc': $query->orderBy('max_marks', 'desc'); break;
            default: $query->latest('exams.created_at');
        }

        $exams = $query->paginate(10)->withQueryString();

        return inertia('Admin/Exams/Index', [
            'exams' => $exams,
            'classes' => Classes::all(),
            'subjects' => Subject::all(),
            'filters' => [
                'search' => $request->search ?? '',
                'class_id' => $request->class_id ?? '',
                'subject_id' => $request->subject_id ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy (unchanged)
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
