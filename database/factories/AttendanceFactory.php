<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'class_id' => Classes::factory(),
            'date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
            'status' => fake()->randomElement(['present', 'absent', 'late', 'excused']),
            'remarks' => fake()->optional()->sentence(),
        ];
    }
}
