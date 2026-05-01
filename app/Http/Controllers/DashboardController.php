<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Guardian;
use App\Models\Exam;
use App\Models\Attendance;
use App\Models\Classes;
use App\Models\Assignment;
use App\Models\Event;
use App\Models\Announcement;
use App\Models\Result;
use App\Models\Lesson;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return $this->adminDashboard();
        }
        if ($user->hasRole('teacher')) {
            return $this->teacherDashboard();
        }
        if ($user->hasRole('student')) {
            // Redirect to the dedicated student dashboard
            return redirect()->route('student.dashboard');
        }
        if ($user->hasRole('guardian')) {
            // Optional: redirect to a dedicated guardian dashboard if you create one later
            // For now, stay with the parent dashboard inside this controller
            return $this->parentDashboard();
        }

        // Fallback (should never happen)
        return inertia('Dashboard', ['message' => 'No dashboard available for your role.']);
    }

    private function adminDashboard()
    {
        // Basic counts
        $stats = [
            'students' => Student::count(),
            'teachers' => Teacher::count(),
            'guardians' => Guardian::count(),
            'classes' => Classes::count(),
            'subjects' => \App\Models\Subject::count(),
            'exams' => Exam::count(),
            'assignments' => Assignment::count(),
            'events' => Event::count(),
            'announcements' => Announcement::count(),
        ];

        // Attendance rate (overall)
        $totalAttendance = Attendance::count();
        $presentCount = Attendance::where('status', 'present')->count();
        $stats['attendanceRate'] = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100, 1) : 0;

        // Recent results (last 5)
        $recentResults = Result::with(['student.user', 'exam', 'subject'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($r) => [
                'student_name' => $r->student->user->name ?? 'N/A',
                'exam_title' => $r->exam->title ?? 'N/A',
                'subject_name' => $r->subject->name ?? 'N/A',
                'marks' => $r->marks_obtained,
            ]);

        // Upcoming events (next 5)
        $upcomingEvents = Event::where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(5)
            ->get(['title', 'start_date', 'venue']);

        // Recent announcements (last 5)
        $recentAnnouncements = Announcement::with('publisher')
            ->latest()
            ->take(5)
            ->get(['title', 'content', 'created_at', 'publisher']);

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'recentResults' => $recentResults,
            'upcomingEvents' => $upcomingEvents,
            'recentAnnouncements' => $recentAnnouncements,
        ]);
    }

    private function teacherDashboard()
    {
        $user = Auth::user();
        $teacher = $user->teacher;

        if (!$teacher) {
            abort(403, 'Teacher profile not found.');
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

        // 👇 ADD THESE STATS
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

    private function studentDashboard()
    {
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            // Student profile missing – show error or fallback
            return inertia('Student/Dashboard', [
                'error' => 'Your student profile is not set up. Please contact the administrator.',
                'upcomingExams' => [],
                'pendingAssignments' => [],
                'attendances' => [],
                'results' => [],
                'events' => [],
            ]);
        }

        $classId = $student->class_id;

        $upcomingExams = Exam::where('class_id', $classId)
            ->with('subject')
            ->where('date', '>=', now())
            ->orderBy('date')
            ->get();

        $pendingAssignments = Assignment::where('class_id', $classId)
            ->with(['subject', 'teacher.user'])
            ->where('due_date', '>=', now())
            ->orderBy('due_date')
            ->get();

        $attendances = Attendance::where('student_id', $student->id)
            ->where('date', '>=', now()->subDays(30))
            ->orderBy('date', 'desc')
            ->get();

        $results = Result::where('student_id', $student->id)
            ->with(['exam', 'subject'])
            ->latest()
            ->take(5)
            ->get();

        $events = Event::where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(5)
            ->get();

        return inertia('Student/Dashboard', [
            'upcomingExams' => $upcomingExams,
            'pendingAssignments' => $pendingAssignments,
            'attendances' => $attendances,
            'results' => $results,
            'events' => $events,
        ]);
    }

    private function parentDashboard()
    {
        $user = Auth::user();
        $guardian = $user->guardian;

        if (!$guardian) {
            return inertia('Parent/Dashboard', [
                'error' => 'Your parent/guardian profile is not set up. Please contact the administrator.',
                'children' => [],
                'events' => [],
            ]);
        }

        $students = $guardian->students()->with(['user', 'class'])->get();

        $childrenData = [];
        foreach ($students as $student) {
            $childrenData[] = [
                'id' => $student->id,
                'name' => $student->user->name,
                'class' => $student->class->name ?? 'Not Assigned',
                'attendance_rate' => $this->getStudentAttendanceRate($student->id),
                'average_marks' => $this->getStudentAverageMarks($student->id),
                'upcoming_exams' => Exam::where('class_id', $student->class_id)
                    ->with('subject')
                    ->where('date', '>=', now())
                    ->orderBy('date')
                    ->take(3)
                    ->get(),
                'recent_results' => Result::where('student_id', $student->id)
                    ->with(['exam', 'subject'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        }

        $events = Event::where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(5)
            ->get();

        return inertia('Parent/Dashboard', [
            'children' => $childrenData,
            'events' => $events,
        ]);
    }

    private function getStudentAttendanceRate($studentId)
    {
        $total = Attendance::where('student_id', $studentId)->count();
        $present = Attendance::where('student_id', $studentId)->where('status', 'present')->count();
        return $total > 0 ? round(($present / $total) * 100, 1) : 0;
    }

    private function getStudentAverageMarks($studentId)
    {
        $avg = Result::where('student_id', $studentId)->avg('marks_obtained');
        return $avg ? round($avg, 1) : 0;
    }
}
