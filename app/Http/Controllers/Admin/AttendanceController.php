<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttendanceController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Attendance::class);
        // Order by latest created first (newest attendance records on top)
        $attendances = Attendance::with(['student.user', 'class'])
                                 ->latest()
                                 ->paginate(10);
        return inertia('Admin/Attendances/Index', ['attendances' => $attendances]);
    }

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
