<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Http\Requests\UserRequest;

/**
 * Class UserCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class UserCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\User::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/user');
        CRUD::setEntityNameStrings('user', 'users');
    }

    protected function setupListOperation()
    {
        CRUD::column('name')->type('text');
        CRUD::column('email')->type('email');
        CRUD::column('role')->type('text');
        CRUD::column('phone')->type('text');
        CRUD::column('address')->type('text');
    }

    protected function setupCreateOperation()
    {
        CRUD::setValidation(UserRequest::class);

        CRUD::field('name');
        CRUD::field('email');
        CRUD::field('password')->type('password');
        CRUD::field('role')->type('select_from_array')->options(['admin' => 'Admin', 'customer' => 'Customer', 'user' => 'User']);
        CRUD::field('phone');
        CRUD::field('address');
    }

    /**
     * Define what happens when the Update operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-update
     * @return void
     */
    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }

    protected function setupShowOperation()
    {
        CRUD::column('name');
        CRUD::column('email');
        CRUD::column('role');
        CRUD::column('phone');
        CRUD::column('address')->type('text');
        CRUD::column('address_line2')->type('text');
        CRUD::column('city');
        CRUD::column('state');
        CRUD::column('zip_code');
        CRUD::column('country');
    }
}
