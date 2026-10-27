<?php

use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

Route::get('/{any?}', function (?string $any = null): Response {
    $spaIndexPath = public_path('index.html');

    if (file_exists($spaIndexPath)) {
        return response()->file($spaIndexPath);
    }

    return response()->view('welcome');
})->where('any', '^(?!api|docs|sanctum).*$');
