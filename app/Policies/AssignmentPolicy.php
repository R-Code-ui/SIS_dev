<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Assignment;

class AssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('admin');
    }
}
