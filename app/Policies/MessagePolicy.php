<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Message;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Message $message): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Message $message): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Message $message): bool
    {
        return $user->hasRole('admin');
    }
}
