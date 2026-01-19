<div class="bp-datagrid p-3">
    <?php $__currentLoopData = $columns; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $column): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="bp-datagrid-item size-<?php echo e($column['size'] ?? '3'); ?>">
            <div class="bp-datagrid-title"><?php echo $column['label']; ?></div>
            <div class="bp-datagrid-content">
                <?php echo $__env->first(\Backpack\CRUD\ViewNamespaces::getViewPathsWithFallbackFor('columns', $column['type'], 'crud::columns.text'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

    <?php if($displayButtons && $crud && $crud->buttons()->where('stack', 'line')->count()): ?>
        <div class="bp-datagrid-item size-12">
            <div class="bp-datagrid-title"><?php echo e(trans('backpack::crud.actions')); ?></div>
            <div class="bp-datagrid-content">
                <?php echo $__env->make('crud::inc.button_stack', ['stack' => 'line'], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            </div>
        </div>
    <?php endif; ?>
</div>
<?php /**PATH C:\Users\Admin\Downloads\E-commerce-FullStack\13.1.26-backend\vendor\backpack\crud\src\resources\views\crud/components/datagrid.blade.php ENDPATH**/ ?>