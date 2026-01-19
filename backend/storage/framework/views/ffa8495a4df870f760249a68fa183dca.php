
<?php echo $__env->renderWhen(!empty($widget['wrapper']), backpack_view('widgets.inc.wrapper_start'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
	
	<?php echo $__env->make($widget['view'], ['widget' => $widget], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

<?php echo $__env->renderWhen(!empty($widget['wrapper']), backpack_view('widgets.inc.wrapper_end'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?><?php /**PATH C:\Users\Admin\Downloads\E-commerce-FullStack\13.1.26-backend\vendor\backpack\crud\src\resources\views\ui/widgets/view.blade.php ENDPATH**/ ?>