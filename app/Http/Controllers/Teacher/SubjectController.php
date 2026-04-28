<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Subject::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $mySubjectIds = $teacher->getMySubjectIds();

        $query = Subject::whereIn('id', $mySubjectIds);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'name_asc');
        switch ($sort) {
            case 'name_asc': $query->orderBy('name', 'asc'); break;
            case 'name_desc': $query->orderBy('name', 'desc'); break;
            case 'code_asc': $query->orderBy('code', 'asc'); break;
            case 'code_desc': $query->orderBy('code', 'desc'); break;
            default: $query->orderBy('name', 'asc');
        }

        $subjects = $query->paginate(10)->withQueryString();

        return inertia('Teacher/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }
}
