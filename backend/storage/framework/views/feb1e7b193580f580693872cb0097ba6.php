<?php $__env->startSection('content'); ?>
    <div class="page page-center">
        <div class="container container-tight py-4">
            <div class="text-center mb-4 display-6 auth-logo-container">
                <?php echo backpack_theme_config('project_logo'); ?>

            </div>
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <div class="nav-link active" data-bs-toggle="tab" aria-selected="true" role="tab"><?php echo e(trans('backpack::base.step')); ?> 1 — <?php echo e(trans('backpack::base.confirm_email')); ?></div>
                        </li>
                        <li class="nav-item" role="presentation">
                            <div class="nav-link disabled" data-bs-toggle="tab" aria-selected="false" tabindex="-1" role="tab"><?php echo e(trans('backpack::base.step')); ?> 2</div>
                        </li>
                        <li class="nav-item ms-auto" role="presentation">
                            <?php echo $__env->renderWhen(backpack_theme_config('options.showColorModeSwitcher'), backpack_view('layouts.partials.switch_theme'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <h3 class="mb-3"><?php echo e(trans('backpack::base.reset_password')); ?></h3>
                    <div class="tab-content">
                        <div class="tab-pane active show" id="tabs-home-7" role="tabpanel">
                            <?php if(session('status')): ?>
                                <div class="alert alert-success mt-3">
                                    <?php echo e(session('status')); ?>

                                </div>
                            <?php else: ?>
                                <form class="col-md-12 p-t-10" role="form" method="POST" action="<?php echo e(route('backpack.auth.password.email')); ?>">
                                    <?php echo csrf_field(); ?>
                                    <div class="mb-3">
                                        <label class="form-label" for="email"><?php echo e(trans('backpack::base.email_address')); ?></label>
                                        <input autofocus type="email" class="form-control <?php echo e($errors->has('email') ? 'is-invalid' : ''); ?>" name="email" id="email" value="<?php echo e(old('email')); ?>">
                                        <?php if($errors->has('email')): ?>
                                            <div class="invalid-feedback"><?php echo e($errors->first('email')); ?></div>
                                        <?php endif; ?>
                                    </div>
                                    <div class="form-footer">
                                        <button type="submit" class="btn btn-primary w-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                                                <path d="M3 7l9 6l9 -6"></path>
                                            </svg>
                                            <?php echo e(trans('backpack::base.send_reset_link')); ?>

                                        </button>
                                    </div>
                                </form>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center pt-3">
                <a href="<?php echo e(route('backpack.auth.login')); ?>"><?php echo e(trans('backpack::base.login')); ?></a>
                <?php if(config('backpack.base.registration_open')): ?>
                    / <a href="<?php echo e(route('backpack.auth.register')); ?>"><?php echo e(trans('backpack::base.register')); ?></a>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make(backpack_view('layouts.auth'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor/backpack/theme-tabler/resources/views/auth/passwords/email.blade.php ENDPATH**/ ?>