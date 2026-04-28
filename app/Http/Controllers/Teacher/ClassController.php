<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Classes::class);

        $teacher = Auth::user()->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $myClassIds = $teacher->getMyClassIds();

        $query = Classes::whereIn('id', $myClassIds);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $sort = $request->get('sort', 'name_asc');
        switch ($sort) {
            case 'name_asc': $query->orderBy('name', 'asc'); break;
            case 'name_desc': $query->orderBy('name', 'desc'); break;
            default: $query->orderBy('name', 'asc');
        }

        $classes = $query->paginate(10)->withQueryString();

        return inertia('Teacher/Classes/Index', [
            'classes' => $classes,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }
}
