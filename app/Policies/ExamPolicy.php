<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Exam;

class ExamPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function view(User $user, Exam $exam): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->classes->contains($exam->class_id);
        }

        if ($user->hasRole('student')) {
            $student = $user->student;
            return $student && $student->class_id === $exam->class_id;
        }

        if ($user->hasRole('guardian')) {
            $guardian = $user->guardian;
            if (!$guardian) return false;
            $childrenClassIds = $guardian->students()->pluck('class_id')->unique();
            return $childrenClassIds->contains($exam->class_id);
        }

        return false;
    }

    public function create(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        if ($user->hasRole('teacher')) {
            return $user->teacher && $user->teacher->classes()->exists();
        }
        return false;
    }

    public function update(User $user, Exam $exam): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->classes->contains($exam->class_id);
        }
        return false;
    }

    public function delete(User $user, Exam $exam): bool
    {
        return $this->update($user, $exam);
    }
}
