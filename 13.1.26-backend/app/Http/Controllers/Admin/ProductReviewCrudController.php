<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class ProductReviewCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ProductReviewCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
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
        CRUD::setModel(\App\Models\ProductReview::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/product-review');
        CRUD::setEntityNameStrings('product review', 'product reviews');
        
        // Deny Create - Reviews should come from customers/API ONLY
        $this->crud->denyAccess(['create']);
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::column('created_at')->label('Date')->type('datetime');
        
        CRUD::column('user_id')
            ->type('select')
            ->label('Customer')
            ->entity('user')
            ->attribute('name')
            ->model("App\Models\User");

        CRUD::column('product_id')
            ->type('select')
            ->label('Product')
            ->entity('product')
            ->attribute('name')
            ->model("App\Models\Product");

        CRUD::column('rating')
            ->type('closure')
            ->function(function($entry) {
                $stars = str_repeat('⭐', $entry->rating);
                return $stars . ' ('.$entry->rating.')';
            });

        CRUD::column('review')->limit(50);
        
        CRUD::column('order_id')
            ->type('select')
            ->label('Order #')
            ->entity('order')
            ->attribute('order_number')
            ->model("App\Models\Order");
            
        $this->crud->orderBy('created_at', 'desc');
    }

    protected function setupUpdateOperation()
    {
        CRUD::field('rating')->type('number')->attributes(['min' => 1, 'max' => 5]);
        CRUD::field('review')->type('textarea');
    }

    protected function setupShowOperation()
    {
        CRUD::column('created_at')->label('Date')->type('datetime');
        
        CRUD::column('user_id')
            ->type('select')
            ->label('Customer')
            ->entity('user')
            ->attribute('name')
            ->model("App\Models\User");

        CRUD::column('product_id')
            ->type('select')
            ->label('Product')
            ->entity('product')
            ->attribute('name')
            ->model("App\Models\Product");

        CRUD::column('rating')->type('number');
        CRUD::column('review')->type('text');
        
        CRUD::column('order_id')
            ->type('select')
            ->label('Order #')
            ->entity('order')
            ->attribute('order_number')
            ->model("App\Models\Order");
    }
}
