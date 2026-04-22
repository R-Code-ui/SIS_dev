<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Result>
 */
class ResultFactory extends Factory
{
    public function definition(): array
    {
        $marks = fake()->numberBetween(40, 100);
        return [
            'student_id' => Student::factory(),
            'exam_id' => Exam::factory(),
            'subject_id' => Subject::factory(),
            'marks_obtained' => $marks,
            'grade' => $marks >= 90 ? 'A' : ($marks >= 80 ? 'B' : ($marks >= 70 ? 'C' : ($marks >= 60 ? 'D' : 'F'))),
            'remarks' => $marks >= 60 ? 'Passed' : 'Failed',
        ];
    }
}
