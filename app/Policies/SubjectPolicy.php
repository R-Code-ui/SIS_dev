<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Subject;

class SubjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    public function view(User $user, Subject $subject): bool
    {
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->isMySubject($subject->id);
        }
        return false;
    }

    public function create(User $user): bool { return $user->hasRole('admin'); }
    public function update(User $user, Subject $subject): bool { return $user->hasRole('admin'); }
    public function delete(User $user, Subject $subject): bool { return $user->hasRole('admin'); }
}
