<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'published_by', 'expiry_date'];

    protected $casts = ['expiry_date' => 'date'];

    public function publisher()
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    // Relationship to targeting rules
    public function targets()
    {
        return $this->hasMany(AnnouncementTarget::class);
    }

    // Scope to filter announcements visible to a user
    public function scopeForUser($query, $user)
    {
        return $query->where(function ($q) use ($user) {
            // 1. Announcements with "all" target
            $q->orWhereHas('targets', fn($t) => $t->where('target_type', 'all'));

            // 2. Announcements targeting the user's role(s)
            $roles = $user->getRoleNames();
            foreach ($roles as $role) {
                $q->orWhereHas('targets', fn($t) => $t->where('target_type', 'role')->where('target_role', $role));
            }

            // 3. For students: announcements targeting their class
            if ($user->hasRole('student') && $user->student && $user->student->class_id) {
                $q->orWhereHas('targets', fn($t) => $t->where('target_type', 'class')->where('target_class_id', $user->student->class_id));
            }

            // 4. For teachers: announcements targeting any of their classes
            if ($user->hasRole('teacher') && $user->teacher) {
                $classIds = $user->teacher->getMyClassIds();
                if (!empty($classIds)) {
                    $q->orWhereHas('targets', fn($t) => $t->where('target_type', 'class')->whereIn('target_class_id', $classIds));
                }
            }

            // 5. For guardians: announcements targeting any class of their children
            if ($user->hasRole('guardian') && $user->guardian) {
                $childrenClassIds = $user->guardian->students()->pluck('class_id')->unique()->filter();
                if ($childrenClassIds->isNotEmpty()) {
                    $q->orWhereHas('targets', fn($t) => $t->where('target_type', 'class')->whereIn('target_class_id', $childrenClassIds));
                }
            }
        });
    }
}
