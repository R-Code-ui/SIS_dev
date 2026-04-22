<?php

namespace App\Http\Controllers\Admin;

use App\Models\Guardian;
use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class GuardianController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Guardian::class);
        $guardians = Guardian::with('user')->withCount('students')->paginate(10);
        return inertia('Admin/Guardians/Index', ['guardians' => $guardians]);
    }

    public function create()
    {
        Gate::authorize('create', Guardian::class);
        $students = Student::with('user')->get();
        return inertia('Admin/Guardians/Create', ['students' => $students]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Guardian::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'occupation' => 'nullable|string',
            'password' => 'required|string|min:8',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);
        $user->assignRole('guardian');

        $guardian = Guardian::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'occupation' => $validated['occupation'],
        ]);

        if (!empty($validated['student_ids'])) {
            $guardian->students()->sync($validated['student_ids']);
        }

        return redirect()->route('admin.guardians.index')->with('success', 'Guardian created successfully.');
    }

    public function edit(Guardian $guardian)
    {
        Gate::authorize('update', $guardian);
        $students = Student::with('user')->get();
        return inertia('Admin/Guardians/Edit', [
            'guardian' => $guardian->load('user', 'students'),
            'students' => $students,
        ]);
    }

    public function update(Request $request, Guardian $guardian)
    {
        Gate::authorize('update', $guardian);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $guardian->user_id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'occupation' => 'nullable|string',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $guardian->user->update(['name' => $validated['name'], 'email' => $validated['email']]);
        $guardian->update([
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'occupation' => $validated['occupation'],
        ]);

        $guardian->students()->sync($validated['student_ids'] ?? []);

        return redirect()->route('admin.guardians.index')->with('success', 'Guardian updated successfully.');
    }

    public function destroy(Guardian $guardian)
    {
        Gate::authorize('delete', $guardian);
        $guardian->user->delete(); // cascade will also remove pivot records if foreign key constraints are set
        return redirect()->route('admin.guardians.index')->with('success', 'Guardian deleted successfully.');
    }
}
