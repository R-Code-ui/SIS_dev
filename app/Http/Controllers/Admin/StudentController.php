<?php

namespace App\Http\Controllers\Admin;

use App\Models\Student;
use App\Models\User;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class StudentController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Student::class);
        $students = Student::with(['user', 'class'])->paginate(10);
        return inertia('Admin/Students/Index', ['students' => $students]);
    }

    public function create()
    {
        Gate::authorize('create', Student::class);
        $classes = Classes::all();
        return inertia('Admin/Students/Create', ['classes' => $classes]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Student::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'admission_no' => 'required|string|unique:students',
            'roll_number' => 'nullable|string',
            'class_id' => 'nullable|exists:classes,id',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('student');

        Student::create([
            'user_id' => $user->id,
            'admission_no' => $validated['admission_no'],
            'roll_number' => $validated['roll_number'],
            'class_id' => $validated['class_id'],
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student created successfully.');
    }

    public function edit(Student $student)
    {
        Gate::authorize('update', $student);
        $classes = Classes::all();
        return inertia('Admin/Students/Edit', ['student' => $student->load('user', 'class'), 'classes' => $classes]);
    }

    public function update(Request $request, Student $student)
    {
        Gate::authorize('update', $student);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $student->user_id,
            'admission_no' => 'required|string|unique:students,admission_no,' . $student->id,
            'roll_number' => 'nullable|string',
            'class_id' => 'nullable|exists:classes,id',
        ]);

        $student->user->update(['name' => $validated['name'], 'email' => $validated['email']]);
        $student->update([
            'admission_no' => $validated['admission_no'],
            'roll_number' => $validated['roll_number'],
            'class_id' => $validated['class_id'],
        ]);

        return redirect()->route('admin.students.index')->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        Gate::authorize('delete', $student);
        $student->user->delete();
        return redirect()->route('admin.students.index')->with('success', 'Student deleted successfully.');
    }
}
