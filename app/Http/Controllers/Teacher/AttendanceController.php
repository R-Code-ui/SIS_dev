<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $myClassIds = $teacher->getMyClassIds();

        $query = Attendance::with(['student.user', 'class'])
            ->whereIn('class_id', $myClassIds);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('student.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('class_id') && in_array($request->class_id, $myClassIds)) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        $sort = $request->get('sort', 'date_desc');
        switch ($sort) {
            case 'date_asc': $query->orderBy('date', 'asc'); break;
            case 'date_desc': $query->orderBy('date', 'desc'); break;
            default: $query->orderBy('date', 'desc');
        }

        $attendances = $query->paginate(10)->withQueryString();

        $classes = $teacher->classes()->get(['id', 'name']);

        return inertia('Teacher/Attendances/Index', [
            'attendances' => $attendances,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class_id', 'date', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Attendance::class);

        $teacher = Auth::user()->teacher;
        $myClassIds = $teacher->getMyClassIds();
        $classes = $teacher->classes()->get(['id', 'name']);

        // Default to first class if none selected
        $selectedClass = request('class_id', $myClassIds[0] ?? null);

        $students = [];
        if ($selectedClass && in_array($selectedClass, $myClassIds)) {
            $students = Student::with('user')->where('class_id', $selectedClass)->get();
        }

        return inertia('Teacher/Attendances/Create', [
            'classes' => $classes,
            'students' => $students,
            'selectedClass' => $selectedClass,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Attendance::class);

        $teacher = Auth::user()->teacher;
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.remarks' => 'nullable|string',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        foreach ($validated['attendances'] as $att) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $att['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'class_id' => $validated['class_id'],
                    'status' => $att['status'],
                    'remarks' => $att['remarks'] ?? null,
                ]
            );
        }

        return redirect()->route('teacher.attendances.index')->with('success', 'Attendance saved.');
    }

    public function edit(Attendance $attendance)
    {
        $this->authorize('update', $attendance);

        $teacher = Auth::user()->teacher;
        if (!$teacher->isMyClass($attendance->class_id)) abort(403);

        $myClassIds = $teacher->getMyClassIds();
        $classes = $teacher->classes()->get(['id', 'name']);
        $students = Student::with('user')->where('class_id', $attendance->class_id)->get();

        // Get all attendance records for that class on the same date
        $records = Attendance::where('class_id', $attendance->class_id)
            ->whereDate('date', $attendance->date)
            ->get()
            ->keyBy('student_id');

        return inertia('Teacher/Attendances/Edit', [
            'attendance' => $attendance,
            'classes' => $classes,
            'students' => $students,
            'records' => $records,
            'selectedClass' => $attendance->class_id,
            'date' => $attendance->date->format('Y-m-d'),
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $this->authorize('update', $attendance);

        $teacher = Auth::user()->teacher;
        if (!$teacher->isMyClass($attendance->class_id)) abort(403);

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.remarks' => 'nullable|string',
        ]);

        if (!$teacher->isMyClass($validated['class_id'])) abort(403);

        foreach ($validated['attendances'] as $att) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $att['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'class_id' => $validated['class_id'],
                    'status' => $att['status'],
                    'remarks' => $att['remarks'] ?? null,
                ]
            );
        }

        return redirect()->route('teacher.attendances.index')->with('success', 'Attendance updated.');
    }

    public function destroy(Attendance $attendance)
    {
        $this->authorize('delete', $attendance);

        $teacher = Auth::user()->teacher;
        if (!$teacher->isMyClass($attendance->class_id)) abort(403);

        $attendance->delete();
        return redirect()->route('teacher.attendances.index')->with('success', 'Attendance record deleted.');
    }
}
