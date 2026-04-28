<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Attendance;

class AttendancePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    public function view(User $user, Attendance $attendance): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->classes->contains($attendance->class_id);
        }

        if ($user->hasRole('student')) {
            $student = $user->student;
            return $student && $student->id === $attendance->student_id;
        }

        if ($user->hasRole('guardian')) {
            $guardian = $user->guardian;
            if (!$guardian) return false;
            $childrenIds = $guardian->students()->pluck('id');
            return $childrenIds->contains($attendance->student_id);
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

    public function update(User $user, Attendance $attendance): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->classes->contains($attendance->class_id);
        }
        return false;
    }

    public function delete(User $user, Attendance $attendance): bool
    {
        return $this->update($user, $attendance);
    }
}
