<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Lesson;

class LessonPolicy
{
    /**
     * Determine if the user can view any lessons (index).
     */
    public function viewAny(User $user): bool
    {
        // Admins and teachers may see a filtered list via controllers
        // Students and parents could also have a separate index, but here we allow all authenticated
        return $user->hasRole('admin') || $user->hasRole('teacher') || $user->hasRole('student') || $user->hasRole('guardian');
    }

    /**
     * Determine if the user can view a specific lesson.
     */
    public function view(User $user, Lesson $lesson): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->classes->contains($lesson->class_id);
        }

        if ($user->hasRole('student')) {
            $student = $user->student;
            return $student && $student->class_id === $lesson->class_id;
        }

        if ($user->hasRole('guardian')) {
            $guardian = $user->guardian;
            if (!$guardian) return false;
            // Guardian can see lessons of any class their children are enrolled in
            $childrenClassIds = $guardian->students()->pluck('class_id')->unique();
            return $childrenClassIds->contains($lesson->class_id);
        }

        return false;
    }

    /**
     * Determine if the user can create a lesson.
     * Only admin and teachers (with own classes) can create.
     */
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

    /**
     * Determine if the user can update a lesson.
     * Only admin and the teacher who owns the class can update.
     */
    public function update(User $user, Lesson $lesson): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            return $teacher && $teacher->classes->contains($lesson->class_id);
        }

        return false;
    }

    /**
     * Determine if the user can delete a lesson.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        return $this->update($user, $lesson);
    }
}
