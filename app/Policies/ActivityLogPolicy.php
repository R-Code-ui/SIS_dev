<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ActivityLog;

class ActivityLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, ActivityLog $log): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool { return false; }
    public function update(User $user, ActivityLog $log): bool { return false; }
    public function delete(User $user, ActivityLog $log): bool { return false; }
}
