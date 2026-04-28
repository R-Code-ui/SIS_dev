<?php

namespace App\Http\Controllers\Admin;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;

class TeacherController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Teacher::class);

        $query = Teacher::with('user');

        // Search by name or email or employee_id
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('employee_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by department
        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'name_asc':
                $query->join('users', 'teachers.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'asc')
                      ->select('teachers.*');
                break;
            case 'name_desc':
                $query->join('users', 'teachers.user_id', '=', 'users.id')
                      ->orderBy('users.name', 'desc')
                      ->select('teachers.*');
                break;
            case 'employee_asc':
                $query->orderBy('employee_id', 'asc');
                break;
            case 'employee_desc':
                $query->orderBy('employee_id', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('teachers.created_at'); // newest first
                break;
        }

        $teachers = $query->paginate(10)->withQueryString();

        // Get unique departments for filter dropdown
        $departments = Teacher::select('department')->distinct()->whereNotNull('department')->pluck('department');

        return inertia('Admin/Teachers/Index', [
            'teachers' => $teachers,
            'departments' => $departments,
            'filters' => [
                'search' => $request->search ?? '',
                'department' => $request->department ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
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
