<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Guardian;

class GuardianPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Guardian $guardian): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Guardian $guardian): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Guardian $guardian): bool
    {
        return $user->hasRole('admin');
    }
}
