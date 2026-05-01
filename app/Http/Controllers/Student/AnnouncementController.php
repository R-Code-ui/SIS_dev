<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with('publisher');

        // Default: show only active (not expired) announcements
        $status = $request->get('status', 'active');

        if ($status === 'active') {
            $query->where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>=', now());
            });
        } elseif ($status === 'expired') {
            $query->whereNotNull('expiry_date')->where('expiry_date', '<', now());
        }
        // 'all' shows everything

        // Search by title or content
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'title_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'title_desc':
                $query->orderBy('title', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->latest('created_at'); // newest first
                break;
        }

        $announcements = $query->paginate(10)->withQueryString();

        return inertia('Student/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'active',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    public function show(Announcement $announcement)
    {
        // Optional: if you want a single view, but the index with modal or expanded row is enough
        // For simplicity, we'll just redirect to index or you can implement a show page.
        // Many systems show full content in a modal. We'll keep it simple: redirect to index.
        return redirect()->route('student.announcements.index');
    }
}
