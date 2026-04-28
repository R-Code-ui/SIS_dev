<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Message::class);

        $user = Auth::user();
        $teacher = $user->teacher;
        if (!$teacher) abort(403, 'Teacher profile not found.');

        $query = Message::with(['sender', 'receiver'])
            ->where(function ($q) use ($user) {
                $q->where('sender_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
            });

        // Search by subject or sender/receiver name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhereHas('sender', fn($sq) => $sq->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('receiver', fn($sq) => $sq->where('name', 'like', "%{$search}%"));
            });
        }

        // Filter by type: sent or received
        if ($request->filled('type')) {
            if ($request->type === 'sent') {
                $query->where('sender_id', $user->id);
            } elseif ($request->type === 'received') {
                $query->where('receiver_id', $user->id);
            }
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'latest': $query->orderBy('created_at', 'desc'); break;
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            case 'subject_asc': $query->orderBy('subject', 'asc'); break;
            case 'subject_desc': $query->orderBy('subject', 'desc'); break;
            default: $query->orderBy('created_at', 'desc');
        }

        $messages = $query->paginate(10)->withQueryString();

        return inertia('Teacher/Messages/Index', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'type', 'sort']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Message::class);

        $user = Auth::user();
        $teacher = $user->teacher;
        if (!$teacher) abort(403);

        // Get possible recipients: students in teacher's classes, parents of those students, and admin
        $myClassIds = $teacher->getMyClassIds();
        $studentIds = \App\Models\Student::whereIn('class_id', $myClassIds)->pluck('user_id');
        $parentIds = \App\Models\Guardian::whereHas('students', fn($q) => $q->whereIn('class_id', $myClassIds))
            ->pluck('user_id');
        $adminIds = User::role('admin')->pluck('id');

        $recipientIds = $studentIds->merge($parentIds)->merge($adminIds)->unique();
        $recipients = User::whereIn('id', $recipientIds)->get(['id', 'name', 'email']);

        return inertia('Teacher/Messages/Create', ['recipients' => $recipients]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Message::class);

        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $validated['sender_id'] = Auth::id();
        $validated['is_read'] = false;

        Message::create($validated);

        return redirect()->route('teacher.messages.index')->with('success', 'Message sent.');
    }

    public function show(Message $message)
    {
        $this->authorize('view', $message);

        $user = Auth::user();
        // Mark as read if the receiver is the current user
        if ($message->receiver_id === $user->id && !$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return inertia('Teacher/Messages/Show', ['message' => $message->load('sender', 'receiver')]);
    }

    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);
        $message->delete();
        return redirect()->route('teacher.messages.index')->with('success', 'Message deleted.');
    }
}
