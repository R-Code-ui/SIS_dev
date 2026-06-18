<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ActivityLogger
{
    public static function log($action, $model = null, $oldValues = null, $newValues = null)
    {
        $request = request();

        $log = new ActivityLog();
        $log->user_id = Auth::id();
        $log->action = $action;
        $log->model_type = $model ? get_class($model) : null;
        $log->model_id = $model ? $model->id : null;
        $log->old_values = $oldValues ? json_encode($oldValues) : null;
        $log->new_values = $newValues ? json_encode($newValues) : null;
        $log->ip_address = $request->ip();
        $log->user_agent = $request->userAgent();
        $log->save();

        return $log;
    }
}
