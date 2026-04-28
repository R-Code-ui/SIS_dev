<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Classes;

class ClassesPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    public function view(User $user, Classes $class): bool
    {
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->isMyClass($class->id);
        }
        return false;
    }

    public function create(User $user): bool { return $user->hasRole('admin'); }
    public function update(User $user, Classes $class): bool { return $user->hasRole('admin'); }
    public function delete(User $user, Classes $class): bool { return $user->hasRole('admin'); }
}
