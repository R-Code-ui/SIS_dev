<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'employee_id', 'department', 'phone', 'address'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Many-to-many with Classes (pivot: teacher_class)
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
}
