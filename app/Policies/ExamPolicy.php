<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Exam;

class ExamPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Exam $exam): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Exam $exam): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Exam $exam): bool
    {
        return $user->hasRole('admin');
    }
}
