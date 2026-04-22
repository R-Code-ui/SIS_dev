<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'admission_no', 'roll_number', 'class_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'student_guardian');
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
