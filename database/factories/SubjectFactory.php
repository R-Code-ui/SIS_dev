<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Data Structures and Algorithms', 'Web Development', 'Calculus', 'Linear Algebra',
                'Object-Oriented Programming', 'Database Management', 'Software Engineering',
                'Computer Networks', 'Operating Systems', 'Artificial Intelligence'
            ]),
            'code' => strtoupper(fake()->unique()->bothify('CS###')),
            'credits' => fake()->numberBetween(2, 4),
            'description' => fake()->sentence(),
        ];
    }
}
