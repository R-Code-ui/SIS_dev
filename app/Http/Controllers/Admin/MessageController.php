<?php

namespace App\Http\Controllers\Admin;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MessageController extends AdminController
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Message::class);

        $query = Message::with(['sender', 'receiver']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%")
                  ->orWhereHas('sender', fn($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('receiver', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('status')) {
            $query->where('is_read', $request->status === 'read' ? 1 : 0);
        }

        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'subject_asc': $query->orderBy('subject', 'asc'); break;
            case 'subject_desc': $query->orderBy('subject', 'desc'); break;
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            default: $query->latest('messages.created_at');
        }

        $messages = $query->paginate(10)->withQueryString();

        return inertia('Admin/Messages/Index', [
            'messages' => $messages,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'sort' => $request->sort ?? 'latest',
            ],
        ]);
    }

    public function destroy(Message $message)
    {
        Gate::authorize('delete', $message);
        $message->delete();
        return redirect()->route('admin.messages.index')->with('success', 'Message deleted successfully.');
    }
}
