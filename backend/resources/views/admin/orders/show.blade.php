@extends(backpack_view('blank'))

@php
  $defaultBreadcrumbs = [
    trans('backpack::crud.admin') => url(config('backpack.base.route_prefix'), 'dashboard'),
    $crud->entity_name_plural => url($crud->route),
    trans('backpack::crud.preview') => false,
  ];

  // if breadcrumbs aren't defined in the CrudController, use the default breadcrumbs
  $breadcrumbs = $breadcrumbs ?? $defaultBreadcrumbs;
@endphp

@section('header')
	<section class="container-fluid d-print-none">
    	<a href="javascript: window.print();" class="btn float-right"><i class="la la-print"></i> Print</a>
		<h2>
	        <span class="text-capitalize">{!! $crud->getHeading() ?? $crud->entity_name_plural !!}</span>
	        <small>{!! $crud->getSubheading() ?? mb_ucfirst(trans('backpack::crud.preview')).' '.$crud->entity_name !!}</small>
	    </h2>
    </section>
@endsection

@section('content')
	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-header d-print-none">
					<a href="{{ url($crud->route) }}" class="btn btn-secondary"><i class="la la-angle-double-left"></i> Back to all  <span>{{ $crud->entity_name_plural }}</span></a>
				</div>
				<div class="card-body">
					
					<!-- Invoice Header -->
					<div class="row mb-4">
						<div class="col-sm-6">
							<h3 class="font-weight-bold">Order #{{ $entry->order_number }}</h3>
							<div><strong>Date:</strong> {{ $entry->created_at->format('M d, Y H:i') }}</div>
							<div><strong>Status:</strong> <span class="badge badge-{{ $entry->status == 'delivered' ? 'success' : ($entry->status == 'cancelled' ? 'danger' : 'warning') }}">{{ ucfirst($entry->status) }}</span></div>
						</div>
					</div>

					<hr>

					<!-- Customer & Shipping Info -->
					<div class="row mb-4">
						<div class="col-sm-6">
							<h5 class="text-muted mb-3">Customer Details</h5>
							<p class="mb-1"><strong>Name:</strong> {{ $entry->first_name }} {{ $entry->last_name }}</p>
							<p class="mb-1"><strong>Email:</strong> {{ $entry->email }}</p>
							<p class="mb-1"><strong>Phone:</strong> {{ $entry->phone }}</p>
						</div>
						<div class="col-sm-6">
							<h5 class="text-muted mb-3">Shipping Address</h5>
							<p class="mb-1">{{ $entry->address }}</p>
							@if($entry->address_line2) <p class="mb-1">{{ $entry->address_line2 }}</p> @endif
							<p class="mb-1">
								{{ $entry->city }}, {{ $entry->state }} - {{ $entry->zip_code }}
							</p>
							<p class="mb-1">{{ $entry->country }}</p>
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
									<th class="text-center">Size</th>
									<th class="text-center">Qty</th>
									<th class="text-right">Total</th>
								</tr>
							</thead>
							<tbody>
								@foreach($entry->orderItems as $item)
								<tr>
									<td class="text-center">
										@php
											// Product image logic based on Product model accessor
											$product = $item->product;
											$images = optional($product)->image ?? []; // Accessor returns array of URLs
											$imgUrl = (is_array($images) && count($images) > 0) ? $images[0] : 'https://placehold.co/50x50?text=No+Img';
										@endphp
										<div>
											<img src="{{ $imgUrl }}" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
										</div>
									</td>
									<td>
										<div class="font-weight-bold">{{ optional($product)->name ?? 'Deleted Product' }}</div>
										<small class="text-muted">ID: {{ $item->product_id }}</small>
									</td>
									<td class="text-center">₹{{ number_format($item->price, 2) }}</td>
									<td class="text-center">{{ $item->size ?? '-' }}</td>
									<td class="text-center">{{ $item->quantity }}</td>
									<td class="text-right">₹{{ number_format($item->price * $item->quantity, 2) }}</td>
								</tr>
								@endforeach
							</tbody>
							<tfoot>
								<tr>
									<td colspan="4" class="text-right">Shipping Fee:</td>
									<td class="text-right">₹{{ number_format($entry->shipping_fee ?? 0, 2) }}</td>
								</tr>

								<tr>
									<td colspan="4" class="text-right font-weight-bold">Total Amount:</td>
									<td class="text-right font-weight-bold">₹{{ number_format($entry->total_amount, 2) }}</td>
								</tr>
							</tfoot>
						</table>
					</div>

				</div>
			</div>
		</div>
	</div>
@endsection
