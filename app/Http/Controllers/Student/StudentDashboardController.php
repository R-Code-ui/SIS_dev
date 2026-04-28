<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller
{
    public function index()
    {
        $student = Auth::user()->student;
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        $classId = $student->class_id;

        // Upcoming exams for student's class
        $upcomingExams = Exam::where('class_id', $classId)
            ->where('date', '>=', now())
            ->orderBy('date')
            ->take(5)
            ->get(['id', 'title', 'date', 'subject_id'])
            ->load('subject:id,name');

        // Pending assignments for student's class (due date >= today)
        $pendingAssignments = Assignment::where('class_id', $classId)
            ->where('due_date', '>=', now())
            ->orderBy('due_date')
            ->take(5)
            ->get(['id', 'title', 'due_date', 'subject_id'])
            ->load('subject:id,name');

        // Attendance summary (last 30 days)
        $totalDays = Attendance::where('student_id', $student->id)
            ->where('date', '>=', now()->subDays(30))
            ->count();
        $presentDays = Attendance::where('student_id', $student->id)
            ->where('status', 'present')
            ->where('date', '>=', now()->subDays(30))
            ->count();
        $attendanceRate = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0;

        // Latest announcements
        $latestAnnouncements = Announcement::where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
            })
            ->latest()
            ->take(3)
            ->get(['id', 'title', 'content', 'created_at']);

        // Upcoming events
        $upcomingEvents = Event::where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(3)
            ->get(['id', 'title', 'start_date', 'venue']);

        return inertia('Student/Dashboard', [
            'upcomingExams' => $upcomingExams,
            'pendingAssignments' => $pendingAssignments,
            'attendanceRate' => $attendanceRate,
            'latestAnnouncements' => $latestAnnouncements,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
