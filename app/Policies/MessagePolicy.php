<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Message;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    public function view(User $user, Message $message): bool
    {
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('teacher')) {
            // Teacher can view messages they sent or received
            return $message->sender_id === $user->id || $message->receiver_id === $user->id;
        }
        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    public function update(User $user, Message $message): bool
    {
        return false; // Messages cannot be edited
    }

    public function delete(User $user, Message $message): bool
    {
        // Teachers can delete their own sent messages (optional)
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('teacher')) {
            return $message->sender_id === $user->id;
        }
        return false;
    }
}
