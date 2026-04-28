<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Teacher profile not found.');
        }

        $query = Student::with(['user', 'class'])
            ->whereIn('class_id', $teacher->getMyClassIds());

        // Filters
        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        // Sorting
        switch ($request->sort) {
            case 'name_desc':
                $query->join('users', 'students.user_id', '=', 'users.id')
                    ->orderBy('users.name', 'desc')
                    ->select('students.*');
                break;

            case 'admission_asc':
                $query->orderBy('admission_no', 'asc');
                break;

            case 'admission_desc':
                $query->orderBy('admission_no', 'desc');
                break;

            default:
                $query->join('users', 'students.user_id', '=', 'users.id')
                    ->orderBy('users.name', 'asc')
                    ->select('students.*');
                break;
        }

        $students = $query->paginate(10)->withQueryString();

        return inertia('Teacher/Students/Index', [
            'students' => $students,
            'classes' => $teacher->classes()->get(),

            // ✅ ALWAYS SEND THIS
            'filters' => [
                'search' => $request->search ?? '',
                'class_id' => $request->class_id ?? '',
                'sort' => $request->sort ?? 'name_asc',
            ],
        ]);
    }
}
