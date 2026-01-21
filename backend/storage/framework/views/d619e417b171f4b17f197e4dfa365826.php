
<?php
    $column['value'] = $column['value'] ?? $entry->{$column['name']};
    $column['escaped'] = $column['escaped'] ?? true;
    $column['prefix'] = $column['prefix'] ?? '';
    $column['suffix'] = $column['suffix'] ?? '';
    $column['wrapper']['element'] = $column['wrapper']['element'] ?? 'pre';
    $column['text'] = $column['default'] ?? '-';
    $column['toggle'] = $column['toggle'] ?? false;

    if ($column['toggle']) {
        $column['wrapper']['class'] = 'd-none mt-2';
    }

    if(is_string($column['value'])) {
        $column['value'] = json_decode($column['value'], true);
    }

    if($column['value'] instanceof \Closure) {
        $column['value'] = $column['value']($entry);
    }

    if(!empty($column['value'])) {
        $column['text'] = $column['prefix'].json_encode($column['value'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).$column['suffix'];
    }
?>

<?php if($column['toggle']): ?>
<button type="button" class="btn btn-sm btn-info" onclick="this.nextElementSibling.classList.toggle('d-none');this.textContent=='Show'?this.textContent='Hide':this.textContent='Show'">Show</button>
<?php endif; ?>
<?php echo $__env->renderWhen(!empty($column['wrapper']), 'crud::columns.inc.wrapper_start', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
<?php if($column['escaped']): ?>
<?php echo e($column['text']); ?>

<?php else: ?>
<?php echo $column['text']; ?>

<?php endif; ?>
<?php echo $__env->renderWhen(!empty($column['wrapper']), 'crud::columns.inc.wrapper_end', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
<?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor\backpack\crud\src\resources\views\crud/columns/json.blade.php ENDPATH**/ ?>