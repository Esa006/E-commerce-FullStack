
<?php
    $column['value'] = $column['value'] ?? data_get($entry, $column['name']);
    $column['escaped'] = $column['escaped'] ?? true;
    $column['prefix'] = $column['prefix'] ?? '';
    $column['suffix'] = $column['suffix'] ?? '';

    if($column['value'] instanceof \Closure) {
        $column['value'] = $column['value']($entry);
    }

    $list = [];
    if ($column['value'] !== null) {
        if (is_array($column['value'])) {
            foreach ($column['value'] as $key => $value) {
                if (! is_null($value)) {
                    $list[$key] = $column['options'][$value] ?? $value;
                }
            }
        } else {
            $list[$column['value']] = $column['options'][$column['value']] ?? $column['value'];
        }
    }
?>

<span>
    <?php if(!empty($list)): ?>
        <?php echo e($column['prefix']); ?>

        <?php $__currentLoopData = $list; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $text): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php
                $related_key = $key;
            ?>

            <span class="d-inline-flex">
                <?php echo $__env->renderWhen(!empty($column['wrapper']), 'crud::columns.inc.wrapper_start', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
                    <?php if($column['escaped']): ?>
                        <?php echo e($text); ?>

                    <?php else: ?>
                        <?php echo $text; ?>

                    <?php endif; ?>
                <?php echo $__env->renderWhen(!empty($column['wrapper']), 'crud::columns.inc.wrapper_end', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>

                <?php if(!$loop->last): ?>, <?php endif; ?>
            </span>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <?php echo e($column['suffix']); ?>

    <?php else: ?>
        <?php echo e($column['default'] ?? '-'); ?>

    <?php endif; ?>
</span>
<?php /**PATH C:\Users\Admin\Downloads\E-commerce-FullStack\13.1.26-backend\vendor\backpack\crud\src\resources\views\crud/columns/select_from_array.blade.php ENDPATH**/ ?>