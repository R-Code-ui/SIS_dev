<?php

namespace App\Http\Controllers\Admin;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class TeacherController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Teacher::class);
        $teachers = Teacher::with('user')->paginate(10);
        return inertia('Admin/Teachers/Index', ['teachers' => $teachers]);
    }

    public function create()
    {
        Gate::authorize('create', Teacher::class);
        return inertia('Admin/Teachers/Create');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Teacher::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'employee_id' => 'required|string|unique:teachers',
            'department' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('teacher');

        Teacher::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'department' => $validated['department'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher created successfully.');
    }

    public function edit(Teacher $teacher)
    {
        Gate::authorize('update', $teacher);
        return inertia('Admin/Teachers/Edit', ['teacher' => $teacher->load('user')]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        Gate::authorize('update', $teacher);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $teacher->user_id,
            'employee_id' => 'required|string|unique:teachers,employee_id,' . $teacher->id,
            'department' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $teacher->user->update(['name' => $validated['name'], 'email' => $validated['email']]);
        $teacher->update([
            'employee_id' => $validated['employee_id'],
            'department' => $validated['department'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ]);

        return redirect()->route('admin.teachers.index')->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher)
    {
        Gate::authorize('delete', $teacher);
        $teacher->user->delete();
        return redirect()->route('admin.teachers.index')->with('success', 'Teacher deleted successfully.');
    }
}
