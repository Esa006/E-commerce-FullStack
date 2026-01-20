<h2 class="card-title text-center my-4"><?php echo e(trans('backpack::base.register')); ?></h2>
<form role="form" method="POST" action="<?php echo e(route('backpack.auth.register')); ?>">
    <?php echo csrf_field(); ?>
    <div class="mb-3">
        <label class="form-label" for="name"><?php echo e(trans('backpack::base.name')); ?></label>
        <input autofocus tabindex="1" type="text" class="form-control <?php echo e($errors->has('name') ? 'is-invalid' : ''); ?>" name="name" id="name" value="<?php echo e(old('name')); ?>">
        <?php if($errors->has('name')): ?>
            <div class="invalid-feedback"><?php echo e($errors->first('name')); ?></div>
        <?php endif; ?>
    </div>

    <div class="mb-3">
        <label class="form-label" for="<?php echo e(backpack_authentication_column()); ?>"><?php echo e(trans('backpack::base.'.strtolower(config('backpack.base.authentication_column_name')))); ?></label>
        <input tabindex="2" type="<?php echo e(backpack_authentication_column()==backpack_email_column()?'email':'text'); ?>" class="form-control <?php echo e($errors->has(backpack_authentication_column()) ? 'is-invalid' : ''); ?>" name="<?php echo e(backpack_authentication_column()); ?>" id="<?php echo e(backpack_authentication_column()); ?>" value="<?php echo e(old(backpack_authentication_column())); ?>">
        <?php if($errors->has(backpack_authentication_column())): ?>
            <div class="invalid-feedback"><?php echo e($errors->first(backpack_authentication_column())); ?></div>
        <?php endif; ?>
    </div>

    <div class="mb-3">
        <label class="form-label" for="password"><?php echo e(trans('backpack::base.password')); ?></label>
        <input tabindex="3" type="password" class="form-control <?php echo e($errors->has('password') ? 'is-invalid' : ''); ?>" name="password" id="password" value="">
        <?php if($errors->has('password')): ?>
            <div class="invalid-feedback"><?php echo e($errors->first('password')); ?></div>
        <?php endif; ?>
    </div>

    <div class="mb-4">
        <label class="form-label" for="password_confirmation"><?php echo e(trans('backpack::base.confirm_password')); ?></label>
        <input tabindex="4" type="password" class="form-control <?php echo e($errors->has('password_confirmation') ? 'is-invalid' : ''); ?>" name="password_confirmation" id="password_confirmation" value="">
        <?php if($errors->has('password_confirmation')): ?>
            <div class="invalid-feedback"><?php echo e($errors->first('password_confirmation')); ?></div>
        <?php endif; ?>
    </div>

    <div class="form-group">
        <div>
            <button tabindex="5" type="submit" class="btn btn-primary w-100">
                <?php echo e(trans('backpack::base.register')); ?>

            </button>
        </div>
    </div>
</form><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\vendor/backpack/theme-tabler/resources/views/auth/register/inc/form.blade.php ENDPATH**/ ?>