<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Event;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }
}
