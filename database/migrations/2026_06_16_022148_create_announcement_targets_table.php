<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcement_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained()->onDelete('cascade');
            $table->enum('target_type', ['role', 'class', 'all'])->default('all');
            $table->string('target_role')->nullable();      // e.g., 'teacher', 'student', 'guardian'
            $table->foreignId('target_class_id')->nullable()->constrained('classes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_targets');
    }
};
