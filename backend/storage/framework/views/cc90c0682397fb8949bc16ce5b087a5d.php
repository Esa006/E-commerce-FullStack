
<?php $__currentLoopData = $fields; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $field): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php echo $__env->make($crud->getFirstFieldView($field['type'], $field['view_namespace'] ?? false), [
        'field' => $field,
        'inlineCreate' => $inlineCreate ?? false,
    ], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

<?php /**PATH C:\Users\Admin\Downloads\E-commerce-FullStack\13.1.26-backend\vendor\backpack\crud\src\resources\views\crud/inc/show_fields.blade.php ENDPATH**/ ?>