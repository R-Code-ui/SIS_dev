<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Result;

class ResultPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Result $result): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Result $result): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Result $result): bool
    {
        return $user->hasRole('admin');
    }
}
