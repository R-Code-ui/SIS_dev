<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->create(['name' => fake()->name()])->id,
            'employee_id' => 'TCH-' . fake()->unique()->numberBetween(1000, 9999),
            'department' => fake()->randomElement(['Computer Studies', 'Engineering', 'Business', 'Education', 'Arts and Sciences']),
            'phone' => '09' . fake()->numerify('########'),
            'address' => fake()->address(),
        ];
    }
}
