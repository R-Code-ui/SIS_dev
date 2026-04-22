<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Assignment>
 */
class AssignmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'class_id' => Classes::factory(),
            'subject_id' => Subject::factory(),
            'teacher_id' => Teacher::factory(),
            'due_date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
            'file_path' => null,
        ];
    }
}
