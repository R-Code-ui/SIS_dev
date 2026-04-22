<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Classes;

class ClassesPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Classes $classes): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Classes $classes): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Classes $classes): bool
    {
        return $user->hasRole('admin');
    }
}
