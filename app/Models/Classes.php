<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = ['name', 'grade_level', 'academic_year', 'section', 'capacity'];

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_class', 'classes_id', 'teacher_id');
    }

    // 👇 Explicitly define the foreign key column
    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subject', 'class_id', 'subject_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'class_id');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'class_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'class_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }
}
