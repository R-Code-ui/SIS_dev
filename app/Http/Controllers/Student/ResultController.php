<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Exam;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $student = Auth::user()->student;
        if (!$student) abort(403, 'Student profile not found.');

        $query = Result::with(['exam', 'subject'])
            ->where('student_id', $student->id);

        // Search by exam title or subject name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('exam', fn($e) => $e->where('title', 'like', "%{$search}%"))
                  ->orWhereHas('subject', fn($s) => $s->where('name', 'like', "%{$search}%"));
            });
        }

        // Filter by exam
        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }

        // Filter by subject
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'exam_asc':
                $query->join('exams', 'results.exam_id', '=', 'exams.id')
                      ->orderBy('exams.title', 'asc')
                      ->select('results.*');
                break;
            case 'exam_desc':
                $query->join('exams', 'results.exam_id', '=', 'exams.id')
                      ->orderBy('exams.title', 'desc')
                      ->select('results.*');
                break;
            case 'subject_asc':
                $query->join('subjects', 'results.subject_id', '=', 'subjects.id')
                      ->orderBy('subjects.name', 'asc')
                      ->select('results.*');
                break;
            case 'subject_desc':
                $query->join('subjects', 'results.subject_id', '=', 'subjects.id')
                      ->orderBy('subjects.name', 'desc')
                      ->select('results.*');
                break;
            case 'marks_asc':
                $query->orderBy('marks_obtained', 'asc');
                break;
            case 'marks_desc':
                $query->orderBy('marks_obtained', 'desc');
                break;
            case 'latest':
            default:
                $query->latest('results.created_at'); // newest first
                break;
        }

        $results = $query->paginate(10)->withQueryString();

        // For filter dropdowns
        $exams = Exam::whereIn('id', Result::where('student_id', $student->id)->pluck('exam_id'))->get();
        $subjects = Subject::whereIn('id', Result::where('student_id', $student->id)->pluck('subject_id'))->get();

        return inertia('Student/Results/Index', [
            'results' => $results,
            'exams' => $exams,
            'subjects' => $subjects,
            'filters' => [
                'search' => $request->search ?? '',
                'exam_id' => $request->exam_id ?? '',
                'subject_id' => $request->subject_id ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }
}
