<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Announcement;

class AnnouncementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin');
    }
}
