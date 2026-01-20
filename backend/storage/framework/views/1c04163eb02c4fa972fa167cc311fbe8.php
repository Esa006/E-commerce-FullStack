<?php
  $error_number = 500;
  $shouldEscape = ! in_array('developer-error-exception', $exception->getHeaders());
?>

<?php $__env->startSection('title'); ?>
  <?php echo e(trans('backpack::base.error_page.500')); ?>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('description'); ?>
  <?php echo $exception?->getMessage() && config('app.debug') ? ($shouldEscape ? e($exception->getMessage()) : $exception->getMessage()) : trans('backpack::base.error_page.message_500'); ?>

<?php $__env->stopSection(); ?>

<?php echo $__env->make(backpack_view('errors.layout'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor/backpack/crud/src/resources/views/ui/errors/500.blade.php ENDPATH**/ ?>