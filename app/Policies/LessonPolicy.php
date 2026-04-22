<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Lesson;

class LessonPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Lesson $lesson): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Lesson $lesson): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Lesson $lesson): bool
    {
        return $user->hasRole('admin');
    }
}
