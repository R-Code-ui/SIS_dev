<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Teacher relationship (already exists)
    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    // 👇 ADD THIS: Student relationship
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    // Optional: Guardian relationship (if needed)
    public function guardian()
    {
        return $this->hasOne(Guardian::class);
    }
}
