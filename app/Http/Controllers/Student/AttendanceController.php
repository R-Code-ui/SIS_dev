<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->student;
        if (!$student) abort(403, 'Student profile not found.');

        // Overall attendance percentage (all time)
        $total = Attendance::where('student_id', $student->id)->count();
        $present = Attendance::where('student_id', $student->id)->where('status', 'present')->count();
        $overallPercentage = $total > 0 ? round(($present / $total) * 100, 1) : 0;

        // Monthly attendance (last 12 months)
        $monthlyData = Attendance::where('student_id', $student->id)
            ->selectRaw('strftime("%Y-%m", date) as month,
                         COUNT(*) as total,
                         SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_count')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->take(12)
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'total' => $item->total,
                    'present' => $item->present_count,
                    'percentage' => $item->total > 0 ? round(($item->present_count / $item->total) * 100, 1) : 0,
                ];
            });

        // Optional: filter by month/year if requested
        if ($request->filled('month')) {
            $monthlyData = $monthlyData->where('month', $request->month);
        }

        return inertia('Student/Attendance/Index', [
            'overallPercentage' => $overallPercentage,
            'monthlyData' => $monthlyData,
            'filters' => [
                'month' => $request->month ?? '',
            ],
        ]);
    }
}
