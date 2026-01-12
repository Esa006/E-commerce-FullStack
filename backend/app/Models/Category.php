<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use CrudTrait;

    protected $fillable = ['name', 'slug', 'image'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (empty($model->slug)) {
                $model->slug = \Illuminate\Support\Str::slug($model->name);
            }
        });
    }

    public function setImageAttribute($value)
    {
        $attribute_name = "image";
        $disk = "public";
        $destination_path = "categories";

        // if the image was erased
        if ($value == null) {
            // delete the image from disk
            \Illuminate\Support\Facades\Storage::disk($disk)->delete($this->{$attribute_name});

            // set null in the database column
            $this->attributes[$attribute_name] = null;
        }

        // if a base64 was sent, store it in the db
        if (\Illuminate\Support\Str::startsWith($value, 'data:image')) {
            // 0. Make the image
            $image = \Intervention\Image\Facades\Image::make($value)->encode('jpg', 90);

            // 1. Generate a filename.
            $filename = md5($value . time()) . '.jpg';

            // 2. Store the image on disk.
            \Illuminate\Support\Facades\Storage::disk($disk)->put($destination_path . '/' . $filename, $image->stream());

            // 3. Delete the previous image, if there was one.
            \Illuminate\Support\Facades\Storage::disk($disk)->delete($this->{$attribute_name});

            // 4. Save the public path to the database
            $this->attributes[$attribute_name] = $destination_path . '/' . $filename;
        }
    }
}
