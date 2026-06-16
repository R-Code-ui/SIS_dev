<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementTarget extends Model
{
    use HasFactory;

    protected $fillable = ['announcement_id', 'target_type', 'target_role', 'target_class_id'];

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }

    public function targetClass()
    {
        return $this->belongsTo(Classes::class, 'target_class_id');
    }
}
