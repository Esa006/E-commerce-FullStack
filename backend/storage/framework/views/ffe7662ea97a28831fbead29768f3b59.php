<?php $__env->startSection('content'); ?>
    <div class="page page-center">
        <div class="container container-tight pt-4">
            <div class="text-center mb-4 display-6 auth-logo-container">
                <?php echo backpack_theme_config('project_logo'); ?>

            </div>
            <div class="card card-md">
                <div class="card-body pt-0">
                    <?php echo $__env->make(backpack_view('auth.register.inc.form'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                </div>
            </div>
            <div class="text-center mt-4">
                <a tabindex="6" href="<?php echo e(route('backpack.auth.login')); ?>"><?php echo e(trans('backpack::base.login')); ?></a>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make(backpack_view('layouts.auth'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor/backpack/theme-tabler/resources/views/auth/register/default.blade.php ENDPATH**/ ?>