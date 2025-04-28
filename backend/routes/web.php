<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-broadcast', function() {
    event(new \App\Events\ItemCreated(\App\Models\Item::first()));
    return 'Event fired';
});
