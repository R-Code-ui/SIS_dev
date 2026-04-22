<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'class_id' => Classes::factory(),
            'subject_id' => Subject::factory(),
            'teacher_id' => Teacher::factory(),
            'date' => fake()->dateTimeBetween('2025-01-01', '2025-06-30'),
            'start_time' => fake()->time('H:i:s', '12:00'),
            'end_time' => fake()->time('H:i:s', '17:00'),
            'materials' => json_encode(['ppt.pdf', 'handout.docx']),
        ];
    }
}
