<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Http\Requests\OrderRequest;

/**
 * Class OrderCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class OrderCrudController extends CrudController
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
        CRUD::setModel(\App\Models\Order::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/order');
        CRUD::setEntityNameStrings('order', 'orders');
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::column('image')
            ->type('closure')
            ->label('Product')
            ->function(function ($entry) {
                $item = $entry->orderItems()->first();
                if ($item && $item->product && !empty($item->product->image)) {
                    $images = $item->product->image;
                    $firstImage = is_array($images) ? ($images[0] ?? null) : $images;
                    if ($firstImage) {
                        return '<img src="' . $firstImage . '" style="height: 45px; width: auto; border-radius: 4px;"/>';
                    }
                }
                return '-';
            })
            ->escaped(false);

        CRUD::column('order_number')->type('text');
        CRUD::column('email')->type('email');
        CRUD::column('total_amount')->type('number')->prefix('₹');
        CRUD::column('shipping_fee')->type('number')->prefix('₹')->label('Shipping');
        
        CRUD::column('status')
            ->type('select_from_array')
            ->options([
                'pending' => 'Pending',
                'confirmed' => 'Confirmed',
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled',
            ])
            ->wrapper([
                'element' => 'span',
                'class' => function ($crud, $column, $entry, $related_key) {
                    if ($entry->status == 'delivered') return 'badge badge-success';
                    if ($entry->status == 'cancelled') return 'badge badge-danger';
                    if ($entry->status == 'pending') return 'badge badge-warning';
                    return 'badge badge-info';
                },
            ]);

        CRUD::column('created_at')->type('datetime');
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(OrderRequest::class);
        
        CRUD::field('user_id')->type('number')->label('User ID (Optional)');
        CRUD::field('order_number')->type('text')->attributes(['readonly' => 'readonly']);
        CRUD::field('email')->type('email');
        CRUD::field('total_amount')->type('number')->prefix('₹');
        CRUD::field('shipping_fee')->type('number')->prefix('₹')->label('Shipping Fee')->default(10);
        
        CRUD::field('status')
            ->type('select_from_array')
            ->options([
                'pending' => 'Pending',
                'confirmed' => 'Confirmed',
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled',
            ])
            ->allows_null(false)
            ->default('pending');

        CRUD::field('payment_method')->type('text');
        CRUD::field('address')->type('text');
        CRUD::field('city')->type('text');
        CRUD::field('state')->type('text');
        CRUD::field('zip_code')->type('text');
        CRUD::field('country')->type('text');
        CRUD::field('phone')->type('text');
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
        $this->crud->setShowView('admin.orders.show');
    }
}
