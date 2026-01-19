<?php
    $field['allows_null'] = $field['allows_null'] ?? $crud->model::isColumnNullable($field['name']);
    $field['value'] = old_empty_or_null($field['name'], '') ??  $field['value'] ?? $field['default'] ?? '';
    $field['multiple'] = $field['allows_multiple'] ?? $field['multiple'] ?? false;
?>

<?php echo $__env->make('crud::fields.inc.wrapper_start', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <label><?php echo $field['label']; ?></label>
    <?php echo $__env->make('crud::fields.inc.translatable_icon', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <?php if($field['multiple']): ?><input type="hidden" name="<?php echo e($field['name']); ?>" value="" <?php if(in_array('disabled', $field['attributes'] ?? [])): ?> disabled <?php endif; ?> /><?php endif; ?>
    <select
        name="<?php echo e($field['name']); ?><?php if($field['multiple']): ?>[]<?php endif; ?>"
        <?php echo $__env->make('crud::fields.inc.attributes', ['default_class' => 'form-control form-select'], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php if($field['multiple']): ?>multiple bp-field-main-input <?php endif; ?>
        >

        <?php if($field['allows_null'] && !$field['multiple']): ?>
            <option value="">-</option>
        <?php endif; ?>

        <?php if(count($field['options'])): ?>
            <?php $__currentLoopData = $field['options']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php if($key == $field['value'] || (is_array($field['value']) && in_array($key, $field['value']))): ?>
                    <option value="<?php echo e($key); ?>" selected><?php echo e($value); ?></option>
                <?php else: ?>
                    <option value="<?php echo e($key); ?>"><?php echo e($value); ?></option>
                <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <?php endif; ?>
    </select>

    
    <?php if(isset($field['hint'])): ?>
        <p class="help-block"><?php echo $field['hint']; ?></p>
    <?php endif; ?>
<?php echo $__env->make('crud::fields.inc.wrapper_end', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php /**PATH C:\Users\Admin\Downloads\E-commerce-FullStack\13.1.26-backend\vendor\backpack\crud\src\resources\views\crud/fields/select_from_array.blade.php ENDPATH**/ ?>