<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('2025-01-01', '2025-12-31');
        $end = clone $start;
        $end->modify('+2 days');
        return [
            'title' => fake()->randomElement(['Foundation Day', 'Sports Fest', 'Cultural Night', 'Tech Summit', 'Career Fair', 'Christmas Party']),
            'description' => fake()->paragraph(),
            'start_date' => $start,
            'end_date' => $end,
            'venue' => fake()->randomElement(['Gymnasium', 'Auditorium', 'Quadrangle', 'Online via Zoom']),
            'created_by' => User::factory(),
        ];
    }
}
