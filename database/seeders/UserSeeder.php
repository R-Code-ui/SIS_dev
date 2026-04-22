<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@sis.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // Teachers
        for ($i = 1; $i <= 10; $i++) {
            $teacher = User::updateOrCreate(
                ['email' => "teacher{$i}@sis.com"],
                [
                    'name' => fake()->name(),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $teacher->assignRole('teacher');
        }

        // Students (10)
        for ($i = 1; $i <= 10; $i++) {
            $student = User::updateOrCreate(
                ['email' => "student{$i}@student.edu.ph"],
                [
                    'name' => fake()->name(),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $student->assignRole('student');
        }

        // Guardians (10)
        for ($i = 1; $i <= 10; $i++) {
            $guardian = User::updateOrCreate(
                ['email' => "guardian{$i}@parent.com"],
                [
                    'name' => fake()->name(),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $guardian->assignRole('guardian');
        }
    }
}
