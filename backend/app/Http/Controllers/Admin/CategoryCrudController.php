<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Http\Requests\CategoryRequest;

/**
 * Class CategoryCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class CategoryCrudController extends CrudController
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
        CRUD::setModel(\App\Models\Category::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/category');
        CRUD::setEntityNameStrings('category', 'categories');
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::column('name');
        CRUD::column('slug');
        CRUD::column('image')
            ->type('closure')
            ->label('Image')
            ->function(function ($entry) {
                if (!$entry->image) return '';
                return '<img src="'. $entry->image .'" style="height: 50px; width: auto; border-radius: 4px;"/>';
            })
            ->escaped(false);
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(CategoryRequest::class);

        CRUD::field('name');
        CRUD::field('slug')->type('text')->hint('Will be automatically generated from name if left empty');
        CRUD::field('image')->type('upload')->upload(true)->disk('public');
    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }

    protected function setupShowOperation()
    {
        CRUD::column('name');
        CRUD::column('slug');
        CRUD::column('image')
            ->type('closure')
            ->label('Image')
            ->function(function ($entry) {
                if (!$entry->image) return '';
                return '<img src="'. $entry->image .'" style="height: 100px; width: auto; border-radius: 4px;"/>';
            })
            ->escaped(false);
    }
}
