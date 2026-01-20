
<?php
    $column['value'] = $column['value'] ?? data_get($entry, $column['name']);
    $column['escaped'] = $column['escaped'] ?? true;
    $column['prefix'] = $column['prefix'] ?? '';
    $column['suffix'] = $column['suffix'] ?? '';
    $column['format'] = $column['format'] ?? backpack_theme_config('default_datetime_format');
    $column['locale'] = $column['locale'] ?? App::getLocale();
    $column['text'] = $column['default'] ?? '-';

    if($column['value'] instanceof \Closure) {
        $column['value'] = $column['value']($entry);
    }

    if(!empty($column['value'])) {
        $date = \Carbon\Carbon::parse($column['value']);

        if ($column['format'] instanceof \Closure) {
            $date = $column['format']($date, $entry);
        } else {
            $date = $date->locale($column['locale'])
                ->isoFormat($column['format']);
        }

        $column['text'] = $column['prefix'].$date.$column['suffix'];
    }
?>

<span data-order="<?php echo e($column['value'] ?? ''); ?>">
    <?php echo $__env->renderWhen(!empty($column['wrapper']), 'crud::columns.inc.wrapper_start', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
        <?php if($column['escaped']): ?>
            <?php echo e($column['text']); ?>

        <?php else: ?>
            <?php echo $column['text']; ?>

        <?php endif; ?>
    <?php echo $__env->renderWhen(!empty($column['wrapper']), 'crud::columns.inc.wrapper_end', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
</span><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor\backpack\crud\src\resources\views\crud/columns/datetime.blade.php ENDPATH**/ ?>