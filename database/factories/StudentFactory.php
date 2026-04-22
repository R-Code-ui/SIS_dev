<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    public function definition(): array
    {
        $firstname = fake()->firstName();
        $lastname = fake()->lastName();
        return [
            'user_id' => User::factory()->create([
                'name' => $firstname . ' ' . $lastname,
                'email' => strtolower($firstname . '.' . $lastname . '@student.edu.ph'),
            ])->id,
            'admission_no' => 'STU-' . fake()->unique()->numberBetween(2024001, 2024999),
            'roll_number' => fake()->numberBetween(1, 50),
            'class_id' => null, // Will be assigned in seeder
        ];
    }
}
