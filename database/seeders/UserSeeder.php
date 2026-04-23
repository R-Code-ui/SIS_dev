<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Classes;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ========== ADMIN ==========
        $admin = User::updateOrCreate(
            ['email' => 'admin@sis.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // ========== TEACHERS (10) ==========
        $teacherNames = [
            'Maria Santos', 'John Dela Cruz', 'Rebecca Mendoza', 'Michael Reyes', 'Jennifer Garcia',
            'Robert Fernandez', 'Catherine Torres', 'James Villanueva', 'Patricia Lopez', 'Daniel Ramirez'
        ];
        $departments = ['Computer Studies', 'Engineering', 'Business', 'Education', 'Arts and Sciences'];

        for ($i = 0; $i < 10; $i++) {
            $user = User::updateOrCreate(
                ['email' => 'teacher' . ($i + 1) . '@sis.com'],
                [
                    'name' => $teacherNames[$i],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('teacher');

            Teacher::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'employee_id' => 'TCH-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'department' => $departments[array_rand($departments)],
                    'phone' => '09' . rand(10000000, 99999999),
                    'address' => 'Block ' . rand(1, 20) . ', ' . fake()->city() . ', Philippines',
                ]
            );
        }

        // ========== STUDENTS (10) ==========
        $studentFirstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Luisa', 'Carlos', 'Rosa', 'Andres', 'Elena'];
        $studentLastNames = ['Dela Cruz', 'Santos', 'Reyes', 'Garcia', 'Fernandez', 'Torres', 'Villanueva', 'Lopez', 'Ramirez', 'Mendoza'];

        // Get existing classes (assuming you have at least one class seeded)
        $classes = Classes::all();
        if ($classes->isEmpty()) {
            // Fallback – create a dummy class if none exist
            $classes = collect([Classes::create(['name' => 'Default Class', 'grade_level' => '1st Year', 'academic_year' => '2024-2025'])]);
        }

        for ($i = 0; $i < 10; $i++) {
            $fullName = $studentFirstNames[$i] . ' ' . $studentLastNames[$i];
            $email = strtolower($studentFirstNames[$i] . '.' . $studentLastNames[$i] . '@student.edu.ph');

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $fullName,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('student');

            Student::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'admission_no' => 'STU-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'roll_number' => $i + 1,
                    'class_id' => $classes->random()->id,
                ]
            );
        }

        // ========== GUARDIANS (10) ==========
        $guardianFirstNames = ['Ramon', 'Luz', 'Rogelio', 'Corazon', 'Dante', 'Fe', 'Gregorio', 'Nenita', 'Oscar', 'Perla'];
        $guardianLastNames = ['Dela Cruz', 'Santos', 'Reyes', 'Garcia', 'Fernandez', 'Torres', 'Villanueva', 'Lopez', 'Ramirez', 'Mendoza'];

        for ($i = 0; $i < 10; $i++) {
            $fullName = $guardianFirstNames[$i] . ' ' . $guardianLastNames[$i];
            $email = strtolower($guardianFirstNames[$i] . '.' . $guardianLastNames[$i] . '@parent.com');

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $fullName,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('guardian');

            Guardian::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'phone' => '09' . rand(10000000, 99999999),
                    'address' => 'House ' . rand(1, 100) . ', ' . fake()->city() . ', Philippines',
                    'occupation' => fake()->randomElement(['Engineer', 'Teacher', 'Business Owner', 'Government Employee', 'OFW', 'Doctor', 'Lawyer']),
                ]
            );
        }
    }
}
