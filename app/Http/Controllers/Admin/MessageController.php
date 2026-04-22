<?php

namespace App\Http\Controllers\Admin;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MessageController extends AdminController
{
    public function index()
    {
        Gate::authorize('viewAny', Message::class);
        // Order by latest created first (newest messages on top)
        $messages = Message::with(['sender', 'receiver'])
                           ->latest()
                           ->paginate(10);
        return inertia('Admin/Messages/Index', ['messages' => $messages]);
    }

    public function destroy(Message $message)
    {
        Gate::authorize('delete', $message);
        $message->delete();
        return redirect()->route('admin.messages.index')->with('success', 'Message deleted successfully.');
    }
}
