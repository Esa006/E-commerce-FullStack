
<?php if(backpack_auth()->check()): ?>
    <ul class="nav navbar-nav d-md-down-none">
        
        <?php echo $__env->make(backpack_view('inc.topbar_left_content'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    </ul>
<?php endif; ?>


<ul class="nav navbar-nav d-flex flex-row flex-shrink-0 <?php if(backpack_theme_config('html_direction') == 'rtl'): ?> me-0 <?php endif; ?>">
    <?php if(backpack_auth()->guest()): ?>
        <li class="nav-item">
            <a class="nav-link" href="<?php echo e(route('backpack.auth.login')); ?>"><?php echo e(trans('backpack::base.login')); ?></a>
        </li>
        <?php if(config('backpack.base.registration_open')): ?>
            <li class="nav-item">
                <a class="nav-link" href="<?php echo e(route('backpack.auth.register')); ?>"><?php echo e(trans('backpack::base.register')); ?></a>
            </li>
        <?php endif; ?>
    <?php else: ?>
        
        <li class="nav-item">
            <?php echo $__env->renderWhen(backpack_theme_config('options.showColorModeSwitcher'), backpack_view('layouts.partials.switch_theme'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
        </li>
        <?php echo $__env->make(backpack_view('inc.topbar_right_content'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php echo $__env->make(backpack_view('inc.menu_user_dropdown'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <?php endif; ?>
</ul>
<?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor/backpack/theme-tabler/resources/views/inc/menu.blade.php ENDPATH**/ ?>