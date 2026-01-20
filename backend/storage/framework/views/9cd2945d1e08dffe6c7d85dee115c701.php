<?php if($crud->hasAccess('create')): ?>
    
    <a href="<?php echo e(url($crud->route.'/create')); ?>" class="btn btn-primary" bp-button="create" data-style="zoom-in">
        <i class="la la-plus"></i> <span><?php echo e(trans('backpack::crud.add')); ?> <?php echo e($crud->entity_name); ?></span>
    </a>
<?php endif; ?><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor\backpack\crud\src\resources\views\crud/buttons/create.blade.php ENDPATH**/ ?>