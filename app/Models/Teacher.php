<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'employee_id', 'department', 'phone', 'address'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'teacher_class', 'teacher_id', 'classes_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    // ========== HELPER METHODS ==========

    /**
     * Get an array of class IDs that this teacher teaches.
     */
    public function getMyClassIds()
    {
        return $this->classes()->pluck('classes.id')->toArray();
    }

    /**
     * Get an array of subject IDs that this teacher teaches via their classes.
     */
    public function getMySubjectIds()
    {
        return Subject::whereHas('classes', function ($query) {
            $query->whereIn('classes.id', $this->getMyClassIds());
        })->pluck('id')->toArray();
    }

    /**
     * Check if a given class ID belongs to this teacher.
     */
    public function isMyClass($classId)
    {
        return in_array($classId, $this->getMyClassIds());
    }

    /**
     * Check if a given subject ID belongs to this teacher (via their classes).
     */
    public function isMySubject($subjectId)
    {
        return in_array($subjectId, $this->getMySubjectIds());
    }

    /**
     * Alias for isMyClass.
     */
    public function hasClass($classId)
    {
        return $this->isMyClass($classId);
    }

    /**
     * Alias for isMySubject.
     */
    public function hasSubject($subjectId)
    {
        return $this->isMySubject($subjectId);
    }
}
