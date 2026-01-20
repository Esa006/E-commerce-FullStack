<header data-bs-theme=<?php echo e($theme ?? 'system'); ?> class="<?php echo e(backpack_theme_config('classes.menuHorizontalContainer') ?? 'navbar-expand-lg top'); ?>">
    <div class="collapse navbar-collapse" id="navbar-menu">
        <div class="d-print-none <?php echo e(backpack_theme_config('classes.menuHorizontalContent') ?? 'navbar navbar-expand-lg navbar-'.($theme ?? 'light').' navbar-'.(($overlap ?? false) ? 'overlap' : '')); ?>">
            <div class="<?php echo e(backpack_theme_config('options.useFluidContainers') ? 'container-fluid' : 'container-xxl'); ?>">
                <ul class="navbar-nav">
                    <?php if (! (backpack_theme_config('options.doubleTopBarInHorizontalLayouts'))): ?>
                        <li class="nav-brand">
                            <a class="nav-link" href="<?php echo e(url(backpack_theme_config('home_link'))); ?>">
                                <?php echo backpack_theme_config('project_logo'); ?>

                            </a>
                        </li>
                    <?php endif; ?>
                    <?php echo $__env->make(backpack_view('inc.sidebar_content'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                </ul>
                <?php if (! (backpack_theme_config('options.doubleTopBarInHorizontalLayouts'))): ?>
                    <?php echo $__env->make(backpack_view('inc.menu'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</header>


<aside data-bs-theme=<?php echo e($theme ?? 'system'); ?> class="navbar navbar-expand-lg navbar-<?php echo e($theme ?? 'light'); ?> d-block d-lg-none">
    <div class="container-fluid">
        <ul class="nav navbar-nav d-flex flex-row align-items-center justify-content-between w-100">
            <?php echo $__env->make(backpack_view('layouts.partials.mobile_toggle_btn'), ['forceWhiteLabelText' => true], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            <div class="d-flex flex-row align-items-center">
                <?php echo $__env->make(backpack_view('inc.topbar_left_content'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                <li class="nav-item me-2">
                    <?php echo $__env->renderWhen(backpack_theme_config('options.showColorModeSwitcher'), backpack_view('layouts.partials.switch_theme'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
                </li>
                <?php echo $__env->make(backpack_view('inc.topbar_right_content'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
                <?php echo $__env->make(backpack_view('inc.menu_user_dropdown'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            </div>
        </ul>
        <div class="collapse navbar-collapse" id="mobile-menu">
            <ul class="navbar-nav pt-lg-3">
                <?php echo $__env->make(backpack_view('inc.sidebar_content'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
            </ul>
        </div>
    </div>
</aside>
<?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor/backpack/theme-tabler/resources/views/layouts/_horizontal/menu_container.blade.php ENDPATH**/ ?>