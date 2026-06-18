<?php

namespace App\Http\Controllers\Admin;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ActivityLogController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', ActivityLog::class);

        $query = ActivityLog::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('model_type', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            default: $query->orderBy('created_at', 'desc');
        }

        $logs = $query->paginate(20)->withQueryString();

        $users = \App\Models\User::all(['id', 'name']);
        $actions = ['created', 'updated', 'deleted', 'login', 'logout'];

        return inertia('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'users' => $users,
            'actions' => $actions,
            'filters' => [
                'search' => $request->search ?? '',
                'action' => $request->action ?? '',
                'user_id' => $request->user_id ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }
}
