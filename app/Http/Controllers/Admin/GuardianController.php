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
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Guardian::class);

        $query = Guardian::with('user')->withCount('students');

        // Search by name, email, phone, or occupation
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('phone', 'like', "%{$search}%")
                  ->orWhere('occupation', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by occupation
        if ($request->filled('occupation')) {
            $query->where('occupation', $request->occupation);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'name_asc':
                $query->join('users', 'guardians.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'asc')
                      ->select('guardians.*');
                break;
            case 'name_desc':
                $query->join('users', 'guardians.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'desc')
                      ->select('guardians.*');
                break;
            case 'email_asc':
                $query->join('users', 'guardians.user_id', '=', 'users.id')
                      ->orderBy('users.email', 'asc')
                      ->select('guardians.*');
                break;
            case 'email_desc':
                $query->join('users', 'guardians.user_id', '=', 'users.id')
                      ->orderBy('users.email', 'desc')
                      ->select('guardians.*');
                break;
            case 'occupation_asc':
                $query->orderBy('occupation', 'asc');
                break;
            case 'occupation_desc':
                $query->orderBy('occupation', 'desc');
                break;
            case 'students_asc':
                $query->orderBy('students_count', 'asc');
                break;
            case 'students_desc':
                $query->orderBy('students_count', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('guardians.created_at');
                break;
        }

        $guardians = $query->paginate(10)->withQueryString();

        // Unique occupations for filter dropdown
        $occupations = Guardian::select('occupation')->distinct()->whereNotNull('occupation')->pluck('occupation');

        return inertia('Admin/Guardians/Index', [
            'guardians' => $guardians,
            'occupations' => $occupations,
            'filters' => [
                'search' => $request->search ?? '',
                'occupation' => $request->occupation ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
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
        $guardian->user->delete();
        return redirect()->route('admin.guardians.index')->with('success', 'Guardian deleted successfully.');
    }
}
