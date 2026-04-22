<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guardian>
 */
class GuardianFactory extends Factory
{
    public function definition(): array
    {
        $firstname = fake()->firstName();
        $lastname = fake()->lastName();
        return [
            'user_id' => User::factory()->create([
                'name' => $firstname . ' ' . $lastname,
                'email' => strtolower($firstname . '.' . $lastname . '@parent.com'),
            ])->id,
            'phone' => '09' . fake()->numerify('########'),
            'address' => fake()->address(),
            'occupation' => fake()->randomElement(['Engineer', 'Teacher', 'Business Owner', 'Government Employee', 'OFW', 'Doctor', 'Lawyer']),
        ];
    }
}
