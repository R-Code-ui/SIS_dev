<?php

namespace App\Http\Controllers\Admin;

use App\Models\Classes;
use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClassesController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Classes::class);

        $query = Classes::withCount(['teachers', 'subjects']);

        // Search by name, grade level, academic year, or section
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('grade_level', 'like', "%{$search}%")
                  ->orWhere('academic_year', 'like', "%{$search}%")
                  ->orWhere('section', 'like', "%{$search}%");
            });
        }

        // Filter by grade level
        if ($request->filled('grade_level')) {
            $query->where('grade_level', $request->grade_level);
        }

        // Filter by academic year
        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'grade_asc':
                $query->orderBy('grade_level', 'asc');
                break;
            case 'grade_desc':
                $query->orderBy('grade_level', 'desc');
                break;
            case 'capacity_asc':
                $query->orderBy('capacity', 'asc');
                break;
            case 'capacity_desc':
                $query->orderBy('capacity', 'desc');
                break;
            case 'teachers_asc':
                $query->orderBy('teachers_count', 'asc');
                break;
            case 'teachers_desc':
                $query->orderBy('teachers_count', 'desc');
                break;
            case 'subjects_asc':
                $query->orderBy('subjects_count', 'asc');
                break;
            case 'subjects_desc':
                $query->orderBy('subjects_count', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('classes.created_at'); // newest first
                break;
        }

        $classes = $query->paginate(10)->withQueryString();

        // Distinct values for filter dropdowns
        $gradeLevels = Classes::select('grade_level')->distinct()->whereNotNull('grade_level')->pluck('grade_level');
        $academicYears = Classes::select('academic_year')->distinct()->whereNotNull('academic_year')->pluck('academic_year');

        return inertia('Admin/Classes/Index', [
            'classes' => $classes,
            'gradeLevels' => $gradeLevels,
            'academicYears' => $academicYears,
            'filters' => [
                'search' => $request->search ?? '',
                'grade_level' => $request->grade_level ?? '',
                'academic_year' => $request->academic_year ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // The rest of the methods (create, store, edit, update, destroy) remain exactly as you have them
    // They are unchanged from your original code – just keep them.
    public function create()
    {
        Gate::authorize('create', Classes::class);
        $teachers = Teacher::with('user')->get();
        $subjects = Subject::all();
        return inertia('Admin/Classes/Create', [
            'teachers' => $teachers,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Classes::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'section' => 'nullable|string|max:10',
            'capacity' => 'nullable|integer|min:1|max:200',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:teachers,id',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $class = Classes::create($validated);

        if (!empty($validated['teacher_ids'])) {
            $class->teachers()->sync($validated['teacher_ids']);
        }
        if (!empty($validated['subject_ids'])) {
            $class->subjects()->sync($validated['subject_ids']);
        }

        return redirect()->route('admin.classes.index')->with('success', 'Class created successfully.');
    }

    public function edit(Classes $class)
    {
        Gate::authorize('update', $class);
        $teachers = Teacher::with('user')->get();
        $subjects = Subject::all();
        return inertia('Admin/Classes/Edit', [
            'class' => $class->load('teachers', 'subjects'),
            'teachers' => $teachers,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, Classes $class)
    {
        Gate::authorize('update', $class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'section' => 'nullable|string|max:10',
            'capacity' => 'nullable|integer|min:1|max:200',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:teachers,id',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $class->update($validated);
        $class->teachers()->sync($validated['teacher_ids'] ?? []);
        $class->subjects()->sync($validated['subject_ids'] ?? []);

        return redirect()->route('admin.classes.index')->with('success', 'Class updated successfully.');
    }

    public function destroy(Classes $class)
    {
        Gate::authorize('delete', $class);
        $class->delete();
        return redirect()->route('admin.classes.index')->with('success', 'Class deleted successfully.');
    }
}
