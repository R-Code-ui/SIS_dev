<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

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
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            case 'subject_asc': $query->orderBy('subject', 'asc'); break;
            case 'subject_desc': $query->orderBy('subject', 'desc'); break;
            default: $query->latest('messages.created_at');
        }

        $messages = $query->paginate(10)->withQueryString();

        return inertia('Student/Messages/Index', [
            'messages' => $messages,
            'filters' => [
                'search' => $request->search ?? '',
                'type' => $request->type ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $student = $user->student;

        // Get possible recipients: teachers (all), guardians (their own), admin
        $teachers = Teacher::with('user')->get()->map(fn($t) => [
            'id' => $t->user->id,
            'name' => $t->user->name,
            'role' => 'teacher'
        ]);

        // If student, also get their guardians
        $guardians = collect();
        if ($student) {
            $guardians = $student->guardians()->with('user')->get()->map(fn($g) => [
                'id' => $g->user->id,
                'name' => $g->user->name,
                'role' => 'guardian'
            ]);
        }

        $admins = User::role('admin')->get()->map(fn($a) => [
            'id' => $a->id,
            'name' => $a->name,
            'role' => 'admin'
        ]);

        $recipients = $teachers->merge($guardians)->merge($admins)->unique('id')->values();

        return inertia('Student/Messages/Create', ['recipients' => $recipients]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $validated['sender_id'] = Auth::id();
        $validated['is_read'] = false;

        Message::create($validated);

        return redirect()->route('student.messages.index')->with('success', 'Message sent.');
    }

    public function show(Message $message)
    {
        $user = Auth::user();
        // Ensure the user is part of the conversation
        if ($message->sender_id !== $user->id && $message->receiver_id !== $user->id) {
            abort(403);
        }

        // Mark as read if the receiver is the current user
        if ($message->receiver_id === $user->id && !$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return inertia('Student/Messages/Show', [
            'message' => $message->load('sender', 'receiver')
        ]);
    }

    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);
        $message->delete();
        return redirect()->route('student.messages.index')->with('success', 'Message deleted.');
    }
}
