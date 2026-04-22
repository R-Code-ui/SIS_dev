<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Subject;
use App\Models\Classes;
use App\Models\Lesson;
use App\Models\Exam;
use App\Models\Assignment;
use App\Models\Result;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Message;
use App\Models\Announcement;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ========== 1. CLEAR PERMISSION CACHE & CREATE ROLES/PERMISSIONS ==========
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions (same as before)
        $adminPermissions = [/* ... list all permissions ... */];
        $teacherPermissions = [/* ... */];
        $studentPermissions = [/* ... */];
        $guardianPermissions = [/* ... */];

        // Create permissions using firstOrCreate
        foreach (array_merge($adminPermissions, $teacherPermissions, $studentPermissions, $guardianPermissions) as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Create roles and sync permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
        $teacherRole->syncPermissions($teacherPermissions);

        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $studentRole->syncPermissions($studentPermissions);

        $guardianRole = Role::firstOrCreate(['name' => 'guardian']);
        $guardianRole->syncPermissions($guardianPermissions);

        // ========== 2. CREATE CLASSES (10) ==========
        $classes = [];
        $gradeLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        $sections = ['A', 'B', 'C'];
        for ($i = 0; $i < 10; $i++) {
            $year = $gradeLevels[array_rand($gradeLevels)];
            $section = $sections[array_rand($sections)];
            $classes[] = Classes::create([
                'name' => $year . ' - Section ' . $section,
                'grade_level' => $year,
                'academic_year' => '2024-2025',
                'section' => $section,
                'capacity' => rand(30, 50),
            ]);
        }

        // ========== 3. CREATE SUBJECTS (10) ==========
        $subjectNames = [
            'Data Structures and Algorithms', 'Web Development', 'Calculus', 'Linear Algebra',
            'Object-Oriented Programming', 'Database Management', 'Software Engineering',
            'Computer Networks', 'Operating Systems', 'Artificial Intelligence'
        ];
        $subjects = [];
        foreach ($subjectNames as $index => $name) {
            $subjects[] = Subject::create([
                'name' => $name,
                'code' => 'CS' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'credits' => rand(2, 4),
                'description' => 'Comprehensive study of ' . $name,
            ]);
        }

        // ========== 4. CREATE ADMIN USER ==========
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@sis.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $adminUser->assignRole('admin');

        // ========== 5. CREATE 10 TEACHERS ==========
        $teachers = [];
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

            $teacher = Teacher::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'employee_id' => 'TCH-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'department' => $departments[array_rand($departments)],
                    'phone' => '09' . rand(10000000, 99999999),
                    'address' => 'Block ' . rand(1, 20) . ', ' . fake()->city() . ', Philippines',
                ]
            );
            $teachers[] = $teacher;
        }

        // ========== 6. CREATE 10 STUDENTS ==========
        $students = [];
        $studentFirstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Luisa', 'Carlos', 'Rosa', 'Andres', 'Elena'];
        $studentLastNames = ['Dela Cruz', 'Santos', 'Reyes', 'Garcia', 'Fernandez', 'Torres', 'Villanueva', 'Lopez', 'Ramirez', 'Mendoza'];
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

            $student = Student::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'admission_no' => 'STU-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'roll_number' => $i + 1,
                    'class_id' => $classes[$i % count($classes)]->id,
                ]
            );
            $students[] = $student;
        }

        // ========== 7. CREATE 10 GUARDIANS ==========
        $guardians = [];
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

            $guardian = Guardian::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'phone' => '09' . rand(10000000, 99999999),
                    'address' => 'House ' . rand(1, 100) . ', ' . fake()->city() . ', Philippines',
                    'occupation' => fake()->randomElement(['Engineer', 'Teacher', 'Business Owner', 'Government Employee', 'OFW', 'Doctor', 'Lawyer']),
                ]
            );
            $guardians[] = $guardian;
        }

        // Link guardians to students
        foreach ($students as $index => $student) {
            $student->guardians()->syncWithoutDetaching([$guardians[$index % count($guardians)]->id => ['relationship' => fake()->randomElement(['Father', 'Mother', 'Guardian'])] ]);
        }

        // Link teachers to classes (2-3 classes each)
        foreach ($teachers as $teacher) {
            $assignedClasses = fake()->randomElements($classes, rand(2, 3));
            foreach ($assignedClasses as $class) {
                $teacher->classes()->syncWithoutDetaching($class->id);
            }
        }

        // Link subjects to classes (4-6 subjects each)
        foreach ($classes as $class) {
            $assignedSubjects = fake()->randomElements($subjects, rand(4, 6));
            foreach ($assignedSubjects as $subject) {
                $class->subjects()->syncWithoutDetaching($subject->id);
            }
        }

        // ========== 8. CREATE OTHER 10 RECORDS EACH ==========
        for ($i = 0; $i < 10; $i++) {
            Lesson::create([
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'class_id' => fake()->randomElement($classes)->id,
                'subject_id' => fake()->randomElement($subjects)->id,
                'teacher_id' => fake()->randomElement($teachers)->id,
                'date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
                'start_time' => fake()->time('H:i:s', '12:00'),
                'end_time' => fake()->time('H:i:s', '17:00'),
                'materials' => null,
            ]);

            Exam::create([
                'title' => fake()->randomElement(['Midterm', 'Final', 'Prelim', 'Quiz 1', 'Quiz 2']),
                'description' => fake()->sentence(),
                'class_id' => fake()->randomElement($classes)->id,
                'subject_id' => fake()->randomElement($subjects)->id,
                'date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
                'max_marks' => 100,
                'passing_marks' => 60,
            ]);

            Assignment::create([
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'class_id' => fake()->randomElement($classes)->id,
                'subject_id' => fake()->randomElement($subjects)->id,
                'teacher_id' => fake()->randomElement($teachers)->id,
                'due_date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
                'file_path' => null,
            ]);

            $marks = rand(40, 100);
            Result::create([
                'student_id' => fake()->randomElement($students)->id,
                'exam_id' => Exam::inRandomOrder()->first()->id,
                'subject_id' => fake()->randomElement($subjects)->id,
                'marks_obtained' => $marks,
                'grade' => $marks >= 90 ? 'A' : ($marks >= 80 ? 'B' : ($marks >= 70 ? 'C' : ($marks >= 60 ? 'D' : 'F'))),
                'remarks' => $marks >= 60 ? 'Passed' : 'Failed',
            ]);

            Attendance::create([
                'student_id' => fake()->randomElement($students)->id,
                'class_id' => fake()->randomElement($classes)->id,
                'date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
                'status' => fake()->randomElement(['present', 'absent', 'late', 'excused']),
                'remarks' => null,
            ]);

            Message::create([
                'sender_id' => fake()->randomElement(User::pluck('id')->toArray()),
                'receiver_id' => fake()->randomElement(User::pluck('id')->toArray()),
                'subject' => fake()->sentence(4),
                'body' => fake()->paragraph(),
                'is_read' => fake()->boolean(50),
            ]);
        }

        // Events (10)
        $eventTitles = ['Foundation Day', 'Sports Fest', 'Cultural Night', 'Tech Summit', 'Career Fair', 'Christmas Party', 'Intramurals', 'Research Congress', 'Alumni Homecoming', 'Freshmen Orientation'];
        for ($i = 0; $i < 10; $i++) {
            $start = fake()->dateTimeBetween('2025-01-01', '2025-12-31');
            $end = (clone $start)->modify('+' . rand(1, 3) . ' days');
            Event::create([
                'title' => $eventTitles[$i],
                'description' => fake()->paragraph(),
                'start_date' => $start,
                'end_date' => $end,
                'venue' => fake()->randomElement(['Gymnasium', 'Auditorium', 'Quadrangle', 'Online via Zoom']),
                'created_by' => $adminUser->id,
            ]);
        }

        // Announcements (10)
        for ($i = 0; $i < 10; $i++) {
            Announcement::create([
                'title' => fake()->sentence(5),
                'content' => fake()->paragraph(),
                'published_by' => $adminUser->id,
                'expiry_date' => fake()->optional()->dateTimeBetween('2025-06-01', '2025-12-31'),
            ]);
        }

        $this->command->info('✅ Database seeded with 10 records per table!');
    }
}
