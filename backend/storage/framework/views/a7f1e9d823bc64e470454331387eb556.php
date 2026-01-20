<?php if($crud->buttons()->where('stack', $stack)->count()): ?>
	<?php $__currentLoopData = $crud->buttons()->where('stack', $stack); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $button): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
	  <?php echo $button->getHtml($entry ?? null, $crud, $crudTableId ?? null); ?>

	<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor\backpack\crud\src\resources\views\crud/inc/button_stack.blade.php ENDPATH**/ ?>