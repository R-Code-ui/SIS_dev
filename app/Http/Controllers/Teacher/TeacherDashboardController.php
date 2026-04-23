<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Assignment;
use App\Models\Lesson;
use Illuminate\Support\Facades\Auth;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Teacher profile not found. Please contact the administrator.');
        }

        $teacherId = $teacher->id;

        $classes = $teacher->classes()->withCount('students')->get();

        $upcomingExams = Exam::whereIn('class_id', $classes->pluck('id'))
            ->with(['class', 'subject'])
            ->where('date', '>=', now())
            ->orderBy('date')
            ->take(5)
            ->get();

        $pendingAssignments = Assignment::where('teacher_id', $teacherId)
            ->with(['class', 'subject'])
            ->where('due_date', '>=', now())
            ->orderBy('due_date')
            ->take(5)
            ->get();

        $recentLessons = Lesson::where('teacher_id', $teacherId)
            ->with(['class', 'subject'])
            ->latest('date')
            ->take(5)
            ->get();

        $totalStudents = $classes->sum('students_count');
        $totalClasses = $classes->count();
        $totalUpcomingExams = $upcomingExams->count();
        $totalPendingAssignments = $pendingAssignments->count();

        return inertia('Teacher/Dashboard', [
            'classes' => $classes,
            'upcomingExams' => $upcomingExams,
            'pendingAssignments' => $pendingAssignments,
            'recentLessons' => $recentLessons,
            'stats' => [
                'totalStudents' => $totalStudents,
                'totalClasses' => $totalClasses,
                'upcomingExams' => $totalUpcomingExams,
                'pendingAssignments' => $totalPendingAssignments,
            ],
        ]);
    }
}
