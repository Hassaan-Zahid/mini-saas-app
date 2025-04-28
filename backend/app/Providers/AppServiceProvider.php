<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Item;
use App\Models\User;
use App\Policies\ItemPolicy;
use App\Policies\UserPolicy;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register any application services.
    }

    public function boot(): void
    {
        Gate::policy(Item::class, ItemPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
