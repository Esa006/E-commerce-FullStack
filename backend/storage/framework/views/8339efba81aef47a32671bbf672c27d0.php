<?php $__env->startSection('content'); ?>
    <div class="page page-center">
        <div class="container container-tight py-4">
            <div class="text-center mb-4 display-6">
                <?php echo backpack_theme_config('project_logo'); ?>

            </div>
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <div class="nav-link disabled" data-bs-toggle="tab" aria-selected="true" role="tab"><?php echo e(trans('backpack::base.step')); ?> 1</div>
                        </li>
                        <li class="nav-item" role="presentation">
                            <div class="nav-link active" data-bs-toggle="tab" aria-selected="false" tabindex="-1" role="tab"><?php echo e(trans('backpack::base.step')); ?> 2 — <?php echo e(trans('backpack::base.choose_new_password')); ?></div>
                        </li>
                        <?php echo $__env->renderWhen(backpack_theme_config('options.showColorModeSwitcher'), backpack_view('layouts.partials.switch_theme'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1])); ?>
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
                                <form class="col-md-12 p-t-10" role="form" method="POST" action="<?php echo e(route('backpack.auth.password.reset')); ?>">
                                    <?php echo csrf_field(); ?>
                                    <input type="hidden" name="token" value="<?php echo e($token); ?>">

                                    <div class="mb-3">
                                        <label class="form-label" for="email"><?php echo e(trans('backpack::base.email_address')); ?></label>
                                        <input autofocus type="email" class="form-control <?php echo e($errors->has('email') ? 'is-invalid' : ''); ?>" name="email" id="email" value="<?php echo e(old('email')); ?>">
                                        <?php if($errors->has('email')): ?>
                                            <div class="invalid-feedback"><?php echo e($errors->first('email')); ?></div>
                                        <?php endif; ?>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="password"><?php echo e(trans('backpack::base.password')); ?></label>
                                        <input type="password" class="form-control <?php echo e($errors->has('password') ? 'is-invalid' : ''); ?>" name="password" id="password" value="">
                                        <?php if($errors->has('password')): ?>
                                            <div class="invalid-feedback"><?php echo e($errors->first('password')); ?></div>
                                        <?php endif; ?>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="password_confirmation"><?php echo e(trans('backpack::base.confirm_password')); ?></label>
                                        <input type="password" class="form-control <?php echo e($errors->has('password_confirmation') ? 'is-invalid' : ''); ?>" name="password_confirmation" id="password_confirmation" value="">
                                        <?php if($errors->has('password_confirmation')): ?>
                                            <div class="invalid-feedback"><?php echo e($errors->first('password_confirmation')); ?></div>
                                        <?php endif; ?>
                                    </div>

                                    <div class="form-footer">
                                        <button type="submit" class="btn btn-primary w-100">
                                            <?php echo e(trans('backpack::base.change_password')); ?>

                                        </button>
                                    </div>
                                </form>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make(backpack_view('layouts.auth'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\Admin\Downloads\E-commerce-FullStack\backend\vendor/backpack/theme-tabler/resources/views/auth/passwords/reset.blade.php ENDPATH**/ ?>