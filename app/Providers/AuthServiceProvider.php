<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Guardian;
use App\Models\Subject;
use App\Models\Classes;
use App\Models\Lesson;
use App\Models\Exam;
use App\Models\Assignment;
use App\Models\Result;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Message;
use App\Models\Announcement;
use App\Policies\TeacherPolicy;
use App\Policies\StudentPolicy;
use App\Policies\GuardianPolicy;
use App\Policies\SubjectPolicy;
use App\Policies\ClassesPolicy;
use App\Policies\LessonPolicy;
use App\Policies\ExamPolicy;
use App\Policies\AssignmentPolicy;
use App\Policies\ResultPolicy;
use App\Policies\AttendancePolicy;
use App\Policies\EventPolicy;
use App\Policies\MessagePolicy;
use App\Policies\AnnouncementPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Teacher::class => TeacherPolicy::class,
        Student::class => StudentPolicy::class,
        Guardian::class => GuardianPolicy::class,
        Subject::class => SubjectPolicy::class,
        Classes::class => ClassesPolicy::class,
        Lesson::class => LessonPolicy::class,
        Exam::class => ExamPolicy::class,
        Assignment::class => AssignmentPolicy::class,
        Result::class => ResultPolicy::class,
        Attendance::class => AttendancePolicy::class,
        Event::class => EventPolicy::class,
        Message::class => MessagePolicy::class,
        Announcement::class => AnnouncementPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
