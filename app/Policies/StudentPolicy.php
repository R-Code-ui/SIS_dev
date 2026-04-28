<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Student;

class StudentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('teacher');
    }

    public function view(User $user, Student $student): bool
    {
        if ($user->hasRole('admin')) return true;
        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            // Check if the student's class is among the teacher's classes
            return $teacher && in_array($student->class_id, $teacher->getMyClassIds());
        }
        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Student $student): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Student $student): bool
    {
        return $user->hasRole('admin');
    }
}
