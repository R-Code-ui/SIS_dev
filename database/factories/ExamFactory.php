<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exam>
 */
class ExamFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->randomElement(['Midterm', 'Final', 'Prelim', 'Quiz 1', 'Quiz 2']),
            'description' => fake()->sentence(),
            'class_id' => Classes::factory(),
            'subject_id' => Subject::factory(),
            'date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
            'max_marks' => 100,
            'passing_marks' => 60,
        ];
    }
}
