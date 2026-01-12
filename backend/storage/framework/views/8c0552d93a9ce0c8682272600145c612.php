

<?php
// if the column has been cast to Carbon or Date (using attribute casting)
// get the value as a date string
if (isset($field['value']) && ($field['value'] instanceof \Carbon\CarbonInterface)) {
    $field['value'] = $field['value']->toDateTimeString();
}

$timestamp = strtotime(old_empty_or_null($field['name'], '') ??  $field['value'] ?? $field['default'] ?? '');

$value = $timestamp ? date('Y-m-d\TH:i:s', $timestamp) : '';
?>

<?php echo $__env->make('crud::fields.inc.wrapper_start', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <label><?php echo $field['label']; ?></label>
    <?php echo $__env->make('crud::fields.inc.translatable_icon', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <?php if(isset($field['prefix']) || isset($field['suffix'])): ?> <div class="input-group"> <?php endif; ?>
        <?php if(isset($field['prefix'])): ?> <span class="input-group-text"><?php echo $field['prefix']; ?></span> <?php endif; ?>
        <input
            type="datetime-local"
            name="<?php echo e($field['name']); ?>"
            value="<?php echo e($value); ?>"
            <?php echo $__env->make('crud::fields.inc.attributes', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        >
        <?php if(isset($field['suffix'])): ?> <span class="input-group-text"><?php echo $field['suffix']; ?></span> <?php endif; ?>
    <?php if(isset($field['prefix']) || isset($field['suffix'])): ?> </div> <?php endif; ?>
    
    
    <?php if(isset($field['hint'])): ?>
        <p class="help-block"><?php echo $field['hint']; ?></p>
    <?php endif; ?>
<?php echo $__env->make('crud::fields.inc.wrapper_end', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php /**PATH C:\xampp\htdocs\backend\vendor\backpack\crud\src\resources\views\crud/fields/datetime.blade.php ENDPATH**/ ?>