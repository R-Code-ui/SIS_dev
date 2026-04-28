<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttendanceController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Attendance::class);

        $query = Attendance::with(['student.user', 'class']);

        // Search by student name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Filter by class
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'date_asc': $query->orderBy('date', 'asc'); break;
            case 'date_desc': $query->orderBy('date', 'desc'); break;
            case 'student_asc':
                $query->join('students', 'attendances.student_id', '=', 'students.id')
                      ->join('users', 'students.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'asc')
                      ->select('attendances.*');
                break;
            case 'student_desc':
                $query->join('students', 'attendances.student_id', '=', 'students.id')
                      ->join('users', 'students.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'desc')
                      ->select('attendances.*');
                break;
            default:
                $query->latest('attendances.created_at');
        }

        $attendances = $query->paginate(10)->withQueryString();

        return inertia('Admin/Attendances/Index', [
            'attendances' => $attendances,
            'classes' => Classes::all(),
            'statuses' => ['present', 'absent', 'late', 'excused'],
            'filters' => [
                'search' => $request->search ?? '',
                'class_id' => $request->class_id ?? '',
                'status' => $request->status ?? '',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    // create, store, edit, update, destroy (unchanged except added filters)
    public function create()
    {
        Gate::authorize('create', Attendance::class);
        $students = Student::with('user')->get();
        $classes = Classes::all();
        return inertia('Admin/Attendances/Create', compact('students', 'classes'));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Attendance::class);
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);
        Attendance::create($validated);
        return redirect()->route('admin.attendances.index')->with('success', 'Attendance record created successfully.');
    }

    public function edit(Attendance $attendance)
    {
        Gate::authorize('update', $attendance);
        $students = Student::with('user')->get();
        $classes = Classes::all();
        return inertia('Admin/Attendances/Edit', compact('attendance', 'students', 'classes'));
    }

    public function update(Request $request, Attendance $attendance)
    {
        Gate::authorize('update', $attendance);
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);
        $attendance->update($validated);
        return redirect()->route('admin.attendances.index')->with('success', 'Attendance record updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        Gate::authorize('delete', $attendance);
        $attendance->delete();
        return redirect()->route('admin.attendances.index')->with('success', 'Attendance record deleted successfully.');
    }
}
