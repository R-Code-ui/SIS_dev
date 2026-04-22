<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(5),
            'content' => fake()->paragraph(),
            'published_by' => User::factory(),
            'expiry_date' => fake()->optional()->dateTimeBetween('2025-06-01', '2025-12-31'),
        ];
    }
}
