<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentDashboardController extends Controller
{
    public function index()
    {
        $guardian = Auth::user()->guardian;
        if (!$guardian) {
            abort(403, 'Guardian profile not found.');
        }

        $students = $guardian->students()->with(['user', 'class'])->get();

        $childrenData = [];
        foreach ($students as $student) {
            $classId = $student->class_id;
            if (!$classId) {
                $childrenData[] = [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'class_name' => 'Not assigned',
                    'attendance_rate' => 0,
                    'upcoming_exams' => [],
                    'pending_assignments' => [],
                ];
                continue;
            }

            // Attendance rate (overall)
            $total = Attendance::where('student_id', $student->id)->count();
            $present = Attendance::where('student_id', $student->id)->where('status', 'present')->count();
            $attendanceRate = $total > 0 ? round(($present / $total) * 100, 1) : 0;

            // Upcoming exams
            $upcomingExams = Exam::where('class_id', $classId)
                ->where('date', '>=', now())
                ->orderBy('date')
                ->take(3)
                ->get(['id', 'title', 'date'])
                ->map(fn($e) => [
                    'id' => $e->id,
                    'title' => $e->title,
                    'date' => $e->date->format('Y-m-d'),
                ]);

            // Pending assignments
            $pendingAssignments = Assignment::where('class_id', $classId)
                ->where('due_date', '>=', now())
                ->orderBy('due_date')
                ->take(3)
                ->get(['id', 'title', 'due_date'])
                ->map(fn($a) => [
                    'id' => $a->id,
                    'title' => $a->title,
                    'due_date' => $a->due_date->format('Y-m-d'),
                ]);

            $childrenData[] = [
                'id' => $student->id,
                'name' => $student->user->name,
                'class_name' => $student->class->name ?? 'Not assigned',
                'attendance_rate' => $attendanceRate,
                'upcoming_exams' => $upcomingExams,
                'pending_assignments' => $pendingAssignments,
            ];
        }

        // Shared announcements (latest 5)
        $latestAnnouncements = Announcement::where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'content', 'created_at']);

        // Upcoming events (next 5)
        $upcomingEvents = Event::where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(5)
            ->get(['id', 'title', 'start_date', 'venue']);

        // Ensure children is always an array (already is)
        return inertia('Parent/Dashboard', [
            'children' => $childrenData,
            'latestAnnouncements' => $latestAnnouncements,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
