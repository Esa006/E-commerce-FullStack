<?php
    $field['wrapper'] = $field['wrapper'] ?? $field['wrapperAttributes'] ?? [];
    $field['wrapper']['data-init-function'] = $field['wrapper']['data-init-function'] ?? 'bpFieldInitUploadMultipleElement';
    $field['wrapper']['data-field-name'] = $field['wrapper']['data-field-name'] ?? $field['name'];

	if(isset($field['parentFieldName'])) {
		if(!empty(old())) {
			$field['value'] = array_merge(
								explode(',',Arr::get(old(), '_order_'.square_brackets_to_dots($field['name'])) ?? ''),
								Arr::get(old(), 'clear_'.square_brackets_to_dots($field['name'])) ?? [],
							);
			$field['value'] = is_array($field['value']) ? array_filter($field['value'] ?? []) : [];
			$field['value'] = $field['value'] === [null] || $field['value'] === [""] ? null : $field['value'];
		}
	}
?>


<?php echo $__env->make('crud::fields.inc.wrapper_start', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <label><?php echo $field['label']; ?></label>
    <?php echo $__env->make('crud::fields.inc.translatable_icon', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

	
	<?php if(isset($field['value'])): ?>
	<?php
		if (is_string($field['value'])) {
			$values = json_decode($field['value'], true) ?? [];
		} else {
			$values = $field['value'];
		}
	?>
	<?php if(count($values)): ?>
    <div class="well well-sm existing-file mb-2">
    	<?php $__currentLoopData = $values; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $file_path): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    		<div class="file-preview">
    			<?php if(isset($field['temporary'])): ?>
		            <a target="_blank" href="<?php echo e(isset($field['disk'])?asset(\Storage::disk($field['disk'])->temporaryUrl($file_path, Carbon\Carbon::now()->addMinutes($field['expiration']))):asset($file_path)); ?>"><?php echo e($file_path); ?></a>
		        <?php else: ?>
		            <a target="_blank" href="<?php echo e(isset($field['disk'])?asset(\Storage::disk($field['disk'])->url($file_path)):asset($file_path)); ?>"><?php echo e($file_path); ?></a>
		        <?php endif; ?>
		    	<a href="#" class="btn btn-light btn-sm float-right file-clear-button" title="Clear file" data-filename="<?php echo e($file_path); ?>"><i class="la la-remove"></i></a>
		    	<div class="clearfix"></div>
	    	</div>
    	<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
    <?php endif; ?>
    <?php endif; ?>
	
	<input name="<?php echo e($field['name']); ?>[]" type="hidden" value="">
	<div class="backstrap-file">
		<input
	        type="file"
	        name="<?php echo e($field['name']); ?>[]"
	        <?php echo $__env->make('crud::fields.inc.attributes', ['default_class' => 'file_input backstrap-file-input'], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
	        multiple
	    >
        <label class="backstrap-file-label" for="customFile"></label>
    </div>

    
    <?php if(isset($field['hint'])): ?>
        <p class="help-block"><?php echo $field['hint']; ?></p>
    <?php endif; ?>

	<?php echo $__env->make('crud::fields.inc.wrapper_end', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>



	<?php $__env->startPush('crud_fields_styles'); ?>
	<?php $bassetBlock = 'backpack/crud/fields/upload-multiple-field.css'; ob_start(); ?>
	<style type="text/css">
		.existing-file {
			border: 1px solid rgba(0,40,100,.12);
			border-radius: 5px;
			padding-left: 10px;
			vertical-align: middle;
		}
		.existing-file a {
			padding-top: 5px;
			display: inline-block;
			font-size: 0.9em;
		}
		.backstrap-file {
			position: relative;
			display: inline-block;
			width: 100%;
			height: calc(1.5em + 0.75rem + 2px);
			margin-bottom: 0;
		}

		.backstrap-file-input {
			position: relative;
			z-index: 2;
			width: 100%;
			height: calc(1.5em + 0.75rem + 2px);
			margin: 0;
			opacity: 0;
		}

		.backstrap-file-input:focus ~ .backstrap-file-label {
			border-color: #acc5ea;
			box-shadow: 0 0 0 0rem rgba(70, 127, 208, 0.25);
		}

		.backstrap-file-input:disabled ~ .backstrap-file-label {
			background-color: #e4e7ea;
		}

		.backstrap-file-input:lang(en) ~ .backstrap-file-label::after {
			content: "Browse";
		}

		.backstrap-file-input ~ .backstrap-file-label[data-browse]::after {
			content: attr(data-browse);
		}

		.backstrap-file-label {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			z-index: 1;
			height: calc(1.5em + 0.75rem + 2px);
			padding: 0.375rem 0.75rem;
			font-weight: 400;
			line-height: 1.5;
			color: #5c6873;
			background-color: #fff;
			border: 1px solid #e4e7ea;
			border-radius: 0.25rem;
			font-weight: 400!important;
		}

		.backstrap-file-label[has-selected-files=true] {
			display: inline-table;
			width: 100%;
		}

		.backstrap-file-label[has-selected-files=true] .badge {
			margin-right: 5px;
			margin-bottom: 5px;
		}

		.backstrap-file-label::after {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 3;
			display: block;
			height: calc(1.5em + 0.75rem);
			padding: 0.375rem 0.75rem;
			line-height: 1.5;
			color: #5c6873;
			content: "Browse";
			background-color: #f0f3f9;
			border-left: inherit;
			border-radius: 0 0.25rem 0.25rem 0;
		}
	</style>
	<?php Basset::bassetBlock($bassetBlock, ob_get_clean()); ?>
	<?php $__env->stopPush(); ?>

    <?php $__env->startPush('crud_fields_scripts'); ?>
    	<?php $bassetBlock = 'backpack/crud/fields/upload-multiple-field.js'; ob_start(); ?>
        <script>
        	function bpFieldInitUploadMultipleElement(element) {
        		var fieldName = element.attr('data-field-name');
        		var clearFileButton = element.find(".file-clear-button");
        		var fileInput = element.find("input[type=file]");
        		var inputLabel = element.find("label.backstrap-file-label");
				let existingFiles = fileInput.parent().siblings('.existing-file');

				if(fileInput.attr('data-row-number')) {
					let selectedFiles = [];
					existingFiles.find('a.file-clear-button').each(function(item) {
						selectedFiles.push($(this).data('filename'));
					});

					$('<input type="hidden" class="order-uploads" name="_order_'+fieldName+'" value="'+selectedFiles+'">').insertAfter(fileInput);

					var observer = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutation) {
							if(mutation.attributeName == 'data-row-number') {
								let field = $(mutation.target);

								fieldOrder = field.siblings('input[name="'+mutation.target.getAttribute('name').slice(0,-2)+'"]')
								fieldOrder.attr('name', '_order_'+mutation.target.getAttribute('name').slice(0,-2));
								let selectedFiles = [];
								fieldOrder.parent().siblings('.existing-file').find('a.file-clear-button').each(function(item) {
									selectedFiles.push($(this).data('filename'));
								});
								fieldOrder.val(selectedFiles);

								fieldClear = field.siblings('.clear-files');
								fieldClear.attr('name', 'clear_'+mutation.target.getAttribute('name'));
							}
						});
					});

					observer.observe(fileInput[0], {
						attributes: true,
					});
				}

		        clearFileButton.click(function(e) {
		        	e.preventDefault();
		        	var container = $(this).parent().parent();
		        	var parent = $(this).parent();
		        	// remove the filename and button
		        	parent.remove();

					if(fileInput.attr('data-row-number')) {
						let selectedFiles = [];
						fileInput.parent().siblings('.existing-file').find('a.file-clear-button').each(function(item) {
							selectedFiles.push($(this).data('filename'));
						});
						if(selectedFiles.length > 0) {
							fileInput.siblings('.order-uploads').val(selectedFiles);
						} else {
							fileInput.siblings('.order-uploads').remove();
						}
					}
		        	// if the file container is empty, remove it
		        	if ($.trim(container.html())=='') {
		        		container.remove();
		        	}
		        	$("<input type='hidden' class='clear-files' name='clear_"+fieldName+"[]' value='"+$(this).data('filename')+"'>").insertAfter(fileInput);
		        });

		        fileInput.change(function() {
					let selectedFiles = [];
					let existingFiles = fileInput.parent().siblings('.existing-file');

					Array.from($(this)[0].files).forEach(file => {
						selectedFiles.push({name: file.name, type: file.type})
					});

					element.find('input').first().val(JSON.stringify(selectedFiles)).trigger('change');

					// create a bunch of span elements with the selected files names to display in the label
					let files = '';
					selectedFiles.forEach(file => {
						files += '<span class="badge mt-1 mb-1 text-bg-secondary badge-primary">'+file.name+'</span> ';
					});
					
					// if existing files is not on the page, create a new div a prepend it to the fileInput
					if(existingFiles.length === 0) {
						existingFiles = $('<div class="well well-sm existing-file mb-2"></div>');
						existingFiles.insertBefore(element.find('input[type=hidden]').first());
						existingFiles.html(files);
					}else {
						// if existing files is on page show the added files after the uploaded ones
						existingFiles.append(files);
					}

		        	// remove the hidden input, so that the setXAttribute method is no longer triggered
					$(this).next("input[type=hidden]:not([name='clear_"+fieldName+"[]']):not([name='_order_"+fieldName+"'])").remove();
		        });

				element.find('input').on('CrudField:disable', function(e) {
					element.children('.backstrap-file').find('input').prop('disabled', 'disabled');
					element.children('.existing-file').find('.file-preview').each(function(i, el) {

						let $deleteButton = $(el).find('a.file-clear-button');

						if(deleteButton.length > 0) {
							$deleteButton.on('click.prevent', function(e) {
								e.stopImmediatePropagation();
								return false;
							});
							// make the event we just registered, the first to be triggered
							$._data($deleteButton.get(0), "events").click.reverse();
						}
					});
				});

				element.on('CrudField:enable', function(e) {
					element.children('.backstrap-file').find('input').removeAttr('disabled');
					element.children('.existing-file').find('.file-preview').each(function(i, el) {
						$(el).find('a.file-clear-button').unbind('click.prevent');
					});
				});
        	}
        </script>
        <?php Basset::bassetBlock($bassetBlock, ob_get_clean()); ?>
    <?php $__env->stopPush(); ?>
<?php /**PATH C:\xampp\htdocs\backend\vendor\backpack\crud\src\resources\views\crud/fields/upload_multiple.blade.php ENDPATH**/ ?>