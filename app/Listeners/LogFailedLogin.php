<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;

class LogFailedLogin
{
    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        if (function_exists('activity')) {
            $activity = activity('auth');

            if ($event->user) {
                $activity->causedBy($event->user)->performedOn($event->user);
            }

            $activity->withProperties([
                'identifier' => $event->credentials['email'] ?? $event->credentials['username'] ?? null,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'guard' => $event->guard,
            ])->log('Percobaan masuk gagal: Kredensial tidak valid');
        }
    }
}
