<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        if ($event->user && function_exists('activity')) {
            activity('auth')
                ->causedBy($event->user)
                ->performedOn($event->user)
                ->withProperties([
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ])
                ->log('Pengguna keluar dari sesi sistem');
        }
    }
}
