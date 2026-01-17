<?php

namespace App\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class ErrorLogCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ErrorLogCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\ErrorLog::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/error-log');
        CRUD::setEntityNameStrings('error log', 'error logs');
        
        // Deny Create/Update - Error logs are read-only
        $this->crud->denyAccess(['create', 'update']);
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::column('created_at')->label('Timestamp')->type('datetime');
        
        CRUD::column('component')
            ->type('closure')
            ->function(function($entry) {
                $color = 'text-primary';
                if (str_contains($entry->component, 'Performance')) $color = 'text-warning';
                if (str_contains($entry->component, 'ErrorBoundary')) $color = 'text-danger';
                return '<span class="'.$color.'">'.e($entry->component).'</span>';
            })
            ->escaped(false);

        CRUD::column('message')->limit(100);
        CRUD::column('url')->limit(30);
        CRUD::column('ip')->label('IP Address');

        CRUD::column('vitals')
            ->label('Performance')
            ->type('closure')
            ->function(function($entry) {
                if (!$entry->vitals) return '-';
                
                // Handle LCP specifically (Legacy/Default)
                if (isset($entry->vitals['LCP'])) {
                    $lcp = number_format($entry->vitals['LCP'], 2);
                    return '<span class="badge badge-info">LCP: '.$lcp.'s</span>';
                }

                // Handle Generic Metrics (New)
                if (isset($entry->vitals['name']) && isset($entry->vitals['value'])) {
                    $unit = $entry->vitals['unit'] ?? 'ms';
                    return '<span class="badge badge-warning">'.$entry->vitals['name'].': '.$entry->vitals['value'].$unit.'</span>';
                }

                return '<span class="badge badge-secondary">Data Attached</span>';
            })
            ->escaped(false);
            
        // Default sort
        $this->crud->orderBy('created_at', 'desc');
    }

    /**
     * Define what happens when the Show operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-show
     * @return void
     */
    protected function setupShowOperation()
    {
        CRUD::column('created_at')->label('Timestamp')->type('datetime');
        CRUD::column('component');
        CRUD::column('message');
        CRUD::column('url');
        CRUD::column('userAgent');
        CRUD::column('ip');
        CRUD::column('vitals')->type('json');
        
        CRUD::column('stack')
            ->type('closure')
            ->label('Stack Trace')
            ->function(function($entry) {
                if (!$entry->stack) return 'None';
                return '<pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; max-height: 400px; overflow: auto; white-space: pre-wrap; font-size: 11px;">'.e($entry->stack).'</pre>';
            })
            ->escaped(false);
    }
}
