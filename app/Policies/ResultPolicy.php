<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Result;

class ResultPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function view(User $user, Result $result): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            // Teacher can view result if the exam belongs to one of their classes
            return $teacher && $teacher->classes->contains($result->exam->class_id ?? null);
        }

        if ($user->hasRole('student')) {
            $student = $user->student;
            return $student && $student->id === $result->student_id;
        }

        if ($user->hasRole('guardian')) {
            $guardian = $user->guardian;
            if (!$guardian) return false;
            // Guardian can view results of their children
            $childrenIds = $guardian->students()->pluck('id');
            return $childrenIds->contains($result->student_id);
        }

        return false;
    }

    public function create(User $user): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        if ($user->hasRole('teacher')) {
            // Teacher can create a result only if they teach the exam's class
            // We cannot check here because we don't have the Exam object yet.
            // So we allow teachers to attempt creation; the controller will check ownership of the exam.
            return $user->teacher && $user->teacher->classes()->exists();
        }
        return false;
    }

    public function update(User $user, Result $result): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            // Teacher can update if the exam belongs to one of their classes
            return $teacher && $teacher->classes->contains($result->exam->class_id ?? null);
        }
        return false;
    }

    public function delete(User $user, Result $result): bool
    {
        return $this->update($user, $result);
    }
}
