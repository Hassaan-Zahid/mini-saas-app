<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ItemPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, Item $item)
    {
        return true;
    }


    public function create(User $user)
    {
        return $user->role_id === Role::USER;
    }

    public function update(User $user, Item $item)
    {
        return $user->id === $item->owner_id || $user->isAdmin();
    }

    public function delete(User $user, Item $item)
    {
        return $user->isAdmin();
    }
}
