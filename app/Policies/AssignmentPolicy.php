<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Assignment;

class AssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function view(User $user, Assignment $assignment): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            // Teacher can view if they created it OR if the class belongs to them
            return $teacher && ($teacher->id === $assignment->teacher_id || $teacher->classes->contains($assignment->class_id));
        }

        if ($user->hasRole('student')) {
            $student = $user->student;
            return $student && $student->class_id === $assignment->class_id;
        }

        if ($user->hasRole('guardian')) {
            $guardian = $user->guardian;
            if (!$guardian) return false;
            $childrenClassIds = $guardian->students()->pluck('class_id')->unique();
            return $childrenClassIds->contains($assignment->class_id);
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

    public function update(User $user, Assignment $assignment): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            // Teacher can update only assignments they created
            return $teacher && $teacher->id === $assignment->teacher_id;
        }
        return false;
    }

    public function delete(User $user, Assignment $assignment): bool
    {
        return $this->update($user, $assignment);
    }
}
