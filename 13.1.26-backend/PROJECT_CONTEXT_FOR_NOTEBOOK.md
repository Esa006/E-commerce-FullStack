# Project Context Summary (for NotebookLM)

This document summarizes the core logic of the E-commerce FullStack project, specifically the recent fixes and architecture for image handling and the Backpack Admin panel.

## 📦 Backend Architecture (Laravel)

### 1. Product Model (`app/Models/Product.php`)
- **Image Handling**: Uses an Accessor (`getImageAttribute`) to decode JSON image arrays and prepend the correct storage path or full URL.
- **Attributes**: Supports `name`, `brand`, `description`, `price`, `stock`, `category`, `subCategory`, `sizes`, and `product_details` (JSON).
- **Stock Tracking**: Includes a `stock_status` appends field for `in_stock`, `low_stock`, and `out_of_stock`.

### 2. Category Model (`app/Models/Category.php`)
- **Structure**: simple categories with `name`, `slug`, and `image`.
- **Accessor**: Automatically prefixes the image path with `storage/` to ensure full accessibility.

### 3. Admin Controllers (`app/Http/Controllers/Admin/`)
- **ProductCrudController**: Manages product lifecycle. Includes custom closures for image thumbnails in lists and a `custom_html` field for image selection preview in the update form.
- **OrderCrudController**: Handles order management. Uses a custom Show view (`admin.orders.show`) for an invoice-like display.
- **ErrorLogCrudController**: Integrated observability that logs frontend errors (React runtime errors, performance issues) directly into the database.

## ⚛️ Frontend Architecture (React)

### 1. Observability Utility (`src/utils/Observability.js`)
- **Error Capturing**: Hooks into `window.onerror` and `window.onunhandledrejection` to report client-side crashes to the `/api/error-report` endpoint.
- **Performance**: Uses `PerformanceObserver` to report Poor LCP (Largest Contentful Paint) > 2.5s.

### 2. Image Rendering
- Frontend components generally expect `product.image` to be an array of full URLs (provided by the Backend accessor).

## 🛠️ Key Fixes Implemented
- **SSL**: Configured local PHP environment with `cacert.pem`.
- **Admin Stability**: Replaced `setFromDb()` with explicit column typing (`text`, `json`, `number`) to prevent "Array to string" conversion crashes.
- **Image Resolution**: Fixed pathing logic to handle both relative storage paths and absolute URLs seamlessly.
