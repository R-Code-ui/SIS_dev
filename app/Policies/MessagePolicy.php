<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Message;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        // Allow all authenticated roles (admin, teacher, student, guardian)
        return $user->hasRole('admin') || $user->hasRole('teacher') ||
               $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function view(User $user, Message $message): bool
    {
        // Admin can view any message
        if ($user->hasRole('admin')) return true;

        // User can view messages they sent or received
        return $message->sender_id === $user->id || $message->receiver_id === $user->id;
    }

    public function create(User $user): bool
    {
        // All authenticated roles can send messages
        return $user->hasRole('admin') || $user->hasRole('teacher') ||
               $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function update(User $user, Message $message): bool
    {
        return false; // Messages cannot be edited
    }

    public function delete(User $user, Message $message): bool
    {
        // Users can delete their own sent messages
        if ($user->hasRole('admin')) return true;
        return $message->sender_id === $user->id;
    }
}
