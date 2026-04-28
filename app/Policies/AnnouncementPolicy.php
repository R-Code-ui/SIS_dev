<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Announcement;

class AnnouncementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function view(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    // Only admin can create, update, delete
    public function create(User $user): bool { return $user->hasRole('admin'); }
    public function update(User $user, Announcement $announcement): bool { return $user->hasRole('admin'); }
    public function delete(User $user, Announcement $announcement): bool { return $user->hasRole('admin'); }
}
