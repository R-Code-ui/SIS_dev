<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('classes_id')->constrained('classes')->onDelete('cascade'); // ← changed to classes_id
            $table->timestamps();
            $table->unique(['teacher_id', 'classes_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_class');
    }
};
