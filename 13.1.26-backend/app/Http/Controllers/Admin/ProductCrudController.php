<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use App\Http\Requests\ProductRequest;

/**
 * Class ProductCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ProductCrudController extends CrudController
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
        CRUD::setModel(\App\Models\Product::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/product');
        CRUD::setEntityNameStrings('product', 'products');
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
            ->label('Image')
            ->function(function ($entry) {
                if (!$entry->image)
                    return '';
                $images = $entry->image;
                $firstImage = is_array($images) ? ($images[0] ?? null) : $images;

                if ($firstImage) {
                    return '<img src="' . $firstImage . '" style="height: 50px; width: auto; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"/>';
                }
                return '';
            })
            ->escaped(false);

        CRUD::column('name')->type('text');
        CRUD::column('brand')->type('text');
        CRUD::column('category')->type('text');
        CRUD::column('subCategory')->type('text');
        CRUD::column('price')->type('number')->prefix('$');
        CRUD::column('stock')->type('number');
        CRUD::column('bestseller')->type('boolean');
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(ProductRequest::class);
        // CRUD::setFromDb(); // set fields from db columns.

        CRUD::field('name');
        CRUD::field('brand');
        CRUD::field('description');
        CRUD::field('price')->type('number')->prefix('$');
        CRUD::field('category');
        CRUD::field('subCategory');
        CRUD::field('sizes');
        CRUD::field('date');
        CRUD::field('stock')->type('number');
        CRUD::field('rating')->type('number')->attributes(['min' => 0, 'max' => 5]);
        CRUD::field('bestseller')->type('checkbox');

        CRUD::field('image')
            ->type('upload_multiple')
            ->label('Product Images')
            ->upload(true)
            ->disk('public');
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

        // 🟢 Show current images preview in Update form
        $entry = $this->crud->getCurrentEntry();
        if ($entry && !empty($entry->image)) {
            $images = $entry->image;
            if (is_array($images)) {
                $html = '<div style="margin-bottom: 15px;"><label>Current Images:</label><div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;">';
                foreach ($images as $img) {
                    $html .= '<img src="' . $img . '" style="height: 80px; width: auto; border-radius: 4px; border: 1px solid #ddd;"/>';
                }
                $html .= '</div></div>';

                CRUD::field('current_images_preview')
                    ->type('custom_html')
                    ->value($html)
                    ->makeFirst();
            }
        }
    }

    /**
     * Define what happens when the Show operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-show
     * @return void
     */
    protected function setupShowOperation()
    {
        CRUD::column('name')->type('text');
        CRUD::column('brand')->type('text');
        CRUD::column('description')->type('text');
        CRUD::column('price')->type('number')->prefix('$');
        CRUD::column('category')->type('text');
        CRUD::column('subCategory')->type('text');
        CRUD::column('sizes')->type('text');
        CRUD::column('stock')->type('number');
        CRUD::column('rating')->type('number');
        CRUD::column('bestseller')->type('boolean');
        CRUD::column('date')->type('date');
        CRUD::column('product_details')->type('json');

        CRUD::column('image')
            ->type('closure')
            ->label('Product Images')
            ->function(function ($entry) {
                if (!$entry->image) return 'No images';
                $images = $entry->image;
                if (!is_array($images)) return $images;
                
                $html = '<div style="display: flex; gap: 10px; flex-wrap: wrap;">';
                foreach ($images as $img) {
                    $html .= '<img src="' . $img . '" style="height: 100px; width: auto; border-radius: 4px; border: 1px solid #ddd;"/>';
                }
                $html .= '</div>';
                return $html;
            })
            ->escaped(false);
    }
}
