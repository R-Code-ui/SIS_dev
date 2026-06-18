<?php

namespace App\Traits;

use App\Helpers\ActivityLogger;

trait LogsActivityTrait
{
    public static function bootLogsActivityTrait()
    {
        static::created(function ($model) {
            ActivityLogger::log('created', $model, null, $model->getAttributes());
        });

        static::updated(function ($model) {
            ActivityLogger::log('updated', $model, $model->getOriginal(), $model->getAttributes());
        });

        static::deleted(function ($model) {
            ActivityLogger::log('deleted', $model, $model->getAttributes(), null);
        });
    }
}
