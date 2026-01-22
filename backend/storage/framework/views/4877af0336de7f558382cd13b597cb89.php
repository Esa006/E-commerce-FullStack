<?php
  $defaultBreadcrumbs = [
    trans('backpack::crud.admin') => url(config('backpack.base.route_prefix'), 'dashboard'),
    $crud->entity_name_plural => url($crud->route),
    trans('backpack::crud.preview') => false,
  ];

  // if breadcrumbs aren't defined in the CrudController, use the default breadcrumbs
  $breadcrumbs = $breadcrumbs ?? $defaultBreadcrumbs;
?>

<?php $__env->startSection('header'); ?>
	<section class="container-fluid d-print-none">
    	<a href="javascript: window.print();" class="btn float-right"><i class="la la-print"></i> Print</a>
		<h2>
	        <span class="text-capitalize"><?php echo $crud->getHeading() ?? $crud->entity_name_plural; ?></span>
	        <small><?php echo $crud->getSubheading() ?? mb_ucfirst(trans('backpack::crud.preview')).' '.$crud->entity_name; ?></small>
	    </h2>
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-header d-print-none">
					<a href="<?php echo e(url($crud->route)); ?>" class="btn btn-secondary"><i class="la la-angle-double-left"></i> Back to all  <span><?php echo e($crud->entity_name_plural); ?></span></a>
				</div>
				<div class="card-body">
					
					<!-- Invoice Header -->
					<div class="row mb-4">
						<div class="col-sm-6">
							<h3 class="font-weight-bold">Order #<?php echo e($entry->order_number); ?></h3>
							<div><strong>Date:</strong> <?php echo e($entry->created_at->format('M d, Y H:i')); ?></div>
							<div><strong>Status:</strong> <span class="badge badge-<?php echo e($entry->status == 'delivered' ? 'success' : ($entry->status == 'cancelled' ? 'danger' : 'warning')); ?>"><?php echo e(ucfirst($entry->status)); ?></span></div>
						</div>
					</div>

					<hr>

					<!-- Customer & Shipping Info -->
					<div class="row mb-4">
						<div class="col-sm-6">
							<h5 class="text-muted mb-3">Customer Details</h5>
							<p class="mb-1"><strong>Name:</strong> <?php echo e($entry->name); ?></p>
							<p class="mb-1"><strong>Email:</strong> <?php echo e($entry->email); ?></p>
							<p class="mb-1"><strong>Phone:</strong> <?php echo e($entry->phone); ?></p>
						</div>
						<div class="col-sm-6">
							<h5 class="text-muted mb-3">Shipping Address</h5>
							<p class="mb-1"><?php echo e($entry->address); ?></p>
							<?php if($entry->address_line2): ?> <p class="mb-1"><?php echo e($entry->address_line2); ?></p> <?php endif; ?>
							<p class="mb-1">
								<?php echo e($entry->city); ?>, <?php echo e($entry->state); ?> - <?php echo e($entry->zip_code); ?>

							</p>
							<p class="mb-1"><?php echo e($entry->country); ?></p>
						</div>
					</div>

					<!-- Order Items -->
					<div class="table-responsive">
						<table class="table table-bordered table-striped">
							<thead>
								<tr>
									<th style="width: 80px;">Image</th>
									<th>Product</th>
									<th class="text-center">Price</th>
									<th class="text-center">Qty</th>
									<th class="text-right">Total</th>
								</tr>
							</thead>
							<tbody>
								<?php $__currentLoopData = $entry->orderItems; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
								<tr>
									<td class="text-center">
										<?php
											// Product image logic based on Product model accessor
											$images = $item->product->image ?? []; // Accessor returns array of URLs
											$imgUrl = count($images) > 0 ? $images[0] : 'https://placehold.co/50x50?text=No+Img';
										?>
										<img src="<?php echo e($imgUrl); ?>" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
									</td>
									<td>
										<div class="font-weight-bold"><?php echo e($item->product->name ?? 'Deleted Product'); ?></div>
										<small class="text-muted">ID: <?php echo e($item->product_id); ?></small>
									</td>
									<td class="text-center">₹<?php echo e(number_format($item->price, 2)); ?></td>
									<td class="text-center"><?php echo e($item->quantity); ?></td>
									<td class="text-right">₹<?php echo e(number_format($item->price * $item->quantity, 2)); ?></td>
								</tr>
								<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
							</tbody>
							<tfoot>
								<tr>
									<td colspan="4" class="text-right font-weight-bold">Total Amount:</td>
									<td class="text-right font-weight-bold">₹<?php echo e(number_format($entry->total_amount, 2)); ?></td>
								</tr>
							</tfoot>
						</table>
					</div>

				</div>
			</div>
		</div>
	</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make(backpack_view('blank'), array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\E-commerce-FullStack\backend\resources\views/admin/orders/show.blade.php ENDPATH**/ ?>