<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classes>
 */
class ClassesFactory extends Factory
{
    public function definition(): array
    {
        $gradeLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        $sections = ['A', 'B', 'C'];
        $year = fake()->randomElement($gradeLevels);
        $section = fake()->randomElement($sections);
        return [
            'name' => $year . ' - Section ' . $section,
            'grade_level' => $year,
            'academic_year' => '2024-2025',
            'section' => $section,
            'capacity' => fake()->numberBetween(30, 50),
        ];
    }
}
