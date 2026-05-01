<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Lesson;
use Illuminate\Support\Facades\Auth;

class ClassController extends Controller
{
    public function index()
    {
        $student = Auth::user()->student;
        if (!$student) abort(403, 'Student profile not found.');

        $class = $student->class;
        if (!$class) {
            return inertia('Student/Classes/Index', [
                'error' => 'You are not assigned to any class yet.',
                'class' => null,
                'timetable' => [],
            ]);
        }

        // Get timetable: lessons for this class, ordered by date and time
        $timetable = Lesson::where('class_id', $class->id)
            ->with(['subject', 'teacher.user'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get()
            ->groupBy(function ($lesson) {
                // Group by day of week (Monday = 1, Sunday = 7)
                return \Carbon\Carbon::parse($lesson->date)->dayOfWeek;
            });

        // Optional: convert to a structured weekly schedule (array for each day)
        $daysOfWeek = [
            1 => 'Monday', 2 => 'Tuesday', 3 => 'Wednesday',
            4 => 'Thursday', 5 => 'Friday', 6 => 'Saturday', 7 => 'Sunday'
        ];

        $weeklySchedule = [];
        foreach ($daysOfWeek as $dayNum => $dayName) {
            $weeklySchedule[$dayName] = $timetable->get($dayNum, collect());
        }

        return inertia('Student/Classes/Index', [
            'class' => $class,
            'weeklySchedule' => $weeklySchedule,
        ]);
    }
}
