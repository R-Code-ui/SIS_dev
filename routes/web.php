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
use App\Http\Controllers\Teacher\StudentController as TeacherStudentController;
use App\Http\Controllers\Teacher\SubjectController as TeacherSubjectController;
use App\Http\Controllers\Teacher\ClassController as TeacherClassController;
use App\Http\Controllers\Teacher\LessonController as TeacherLessonController;
use App\Http\Controllers\Teacher\ExamController as TeacherExamController;
use App\Http\Controllers\Teacher\AssignmentController as TeacherAssignmentController;
use App\Http\Controllers\Teacher\ResultController as TeacherResultController;
use App\Http\Controllers\Teacher\AttendanceController as TeacherAttendanceController;
use App\Http\Controllers\Teacher\EventController as TeacherEventController;
use App\Http\Controllers\Teacher\MessageController as TeacherMessageController;
use App\Http\Controllers\Teacher\AnnouncementController as TeacherAnnouncementController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\AssignmentController as StudentAssignmentController;
use App\Http\Controllers\Student\ResultController as StudentResultController;
use App\Http\Controllers\Student\AttendanceController as StudentAttendanceController;
use App\Http\Controllers\Student\EventController as StudentEventController;
use App\Http\Controllers\Student\MessageController as StudentMessageController;
use App\Http\Controllers\Student\AnnouncementController as StudentAnnouncementController;
use App\Http\Controllers\Student\ClassController as StudentClassController;
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
        Route::resource('students', TeacherStudentController::class)->only(['index']);
        Route::resource('subjects', TeacherSubjectController::class)->only(['index']);
        Route::resource('classes', TeacherClassController::class)->only(['index']);
        Route::resource('lessons', TeacherLessonController::class);
        Route::resource('exams', TeacherExamController::class);
        Route::resource('assignments', TeacherAssignmentController::class);
        Route::resource('results', TeacherResultController::class);
        Route::resource('attendances', TeacherAttendanceController::class);
        Route::resource('events', TeacherEventController::class)->only(['index', 'show']);
        Route::resource('messages', TeacherMessageController::class);
        Route::resource('announcements', TeacherAnnouncementController::class)->only(['index', 'show']);
    });

// Student routes (protected by auth + role:student)
Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');

        // Student modules (to be implemented)
        // Route::resource('assignments', StudentAssignmentController::class)->only(['index', 'show', 'store']);
        // Route::resource('results', StudentResultController::class)->only(['index']);
        // Route::resource('attendances', StudentAttendanceController::class)->only(['index']);
        // Route::resource('events', StudentEventController::class)->only(['index']);
        // Route::resource('messages', StudentMessageController::class);
        // Route::resource('announcements', StudentAnnouncementController::class)->only(['index', 'show']);
        // Route::resource('classes', StudentClassController::class)->only(['index']);
    });

// Authentication routes (login, register, etc.)
require __DIR__.'/auth.php';
