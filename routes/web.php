<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\GuardianController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\ClassesController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\AssignmentController;
use App\Http\Controllers\Admin\ResultController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard (role‑based)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Profile routes (authenticated)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes (protected by auth + role:admin via controller middleware)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('teachers', TeacherController::class);
    Route::resource('students', StudentController::class);
    Route::resource('guardians', GuardianController::class);
    Route::resource('subjects', SubjectController::class);
    Route::resource('classes', ClassesController::class);
    Route::resource('lessons', LessonController::class);
    Route::resource('exams', ExamController::class);
    Route::resource('assignments', AssignmentController::class);
    Route::resource('results', ResultController::class);
    Route::resource('attendances', AttendanceController::class);
    Route::resource('events', EventController::class);
    Route::resource('messages', MessageController::class)->only(['index', 'destroy']);
    Route::resource('announcements', AnnouncementController::class);
});

// Teacher routes (protected by auth + role:teacher)
Route::middleware(['auth', 'verified', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
        // Other teacher resource routes will be added later (students, subjects, etc.)
    });

// Authentication routes (login, register, etc.)
require __DIR__.'/auth.php';
