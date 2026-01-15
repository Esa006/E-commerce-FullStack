# Backend Implementation Instructions (Laravel)

Here is the code you need to add to your Laravel backend to support the **Flexible Product Attributes**.

## 1. Database Migration
Run this command to create a migration:
`php artisan make:migration add_product_details_to_products_table --table=products`

**File:** `database/migrations/xxxx_xx_xx_xxxxxx_add_product_details_to_products_table.php`

```php
public function up()
{
    Schema::table('products', function (Blueprint $table) {
        $table->json('product_details')->nullable();
    });
}

public function down()
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropColumn('product_details');
    });
}
```

Run the migration: `php artisan migrate`

---

## 2. Update Product Model
**File:** `app/Models/Product.php`

Add `product_details` to `$fillable` and add the `$casts` property.

```php
protected $fillable = [
    // ... existing fields
    'product_details',
];

protected $casts = [
    'product_details' => 'array', // Automatically converts JSON to Array
];
```

---

## 3. Populate Data Script (One-time)
Create a file named `populate_details.php` in your root or `scripts` folder, or just use `php artisan tinker`.

**Using Tinker (fastest way):**
Run `php artisan tinker` and paste this:

```php
$products = \App\Models\Product::all();

foreach ($products as $product) {
    // Example data - logic can be customized based on category if needed
    $details = [
        "Primary Color" => "Orange & Blue",
        "Fit" => "Regular Fit",
        "Fabric Composition" => "100% Cotton",
        "Wash Care" => "Machine wash",
        "Neckline" => "Collar",
        "Product Code" => "Code-" . $product->id,
        "Country Of Origin" => "Cambodia"
    ];
    
    $product->product_details = $details;
    $product->save();
}
```
