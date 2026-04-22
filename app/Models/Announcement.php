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
}
