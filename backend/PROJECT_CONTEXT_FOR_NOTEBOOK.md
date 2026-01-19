# Project Context Summary (for NotebookLM)

This document summarizes the core logic of the E-commerce FullStack project, specifically the recent fixes and architecture for image handling and the Backpack Admin panel.

## 📦 Backend Architecture (Laravel)

### 1. Product Model (`app/Models/Product.php`)
- **Image Handling**: Uses an Accessor (`getImageAttribute`) to decode JSON image arrays and prepend the correct storage path or full URL.
- **Attributes**: Supports `name`, `brand`, `description`, `price`, `stock`, `category`, `subCategory`, `sizes`, and `product_details` (JSON).
- **Stock Tracking**: Includes a `stock_status` appends field for `in_stock`, `low_stock`, and `out_of_stock`.

### **6. Order Cancellation & Stock Restoration**
Implemented a smart inventory loop for order management.
- **Action**: Added a `cancelled` state to the Order status workflow.
- **Result**: When an admin cancels a `pending`, `confirmed`, or `shipped` order, the system **automatically adds the items back to the product stock**. This prevents inventory leaks.

### 2. Category Model (`app/Models/Category.php`)
- **Structure**: simple categories with `name`, `slug`, and `image`.
- **Accessor**: Automatically prefixes the image path with `storage/` to ensure full accessibility.

### 3. Admin Controllers (`app/Http/Controllers/Admin/`)
- **ProductCrudController**: Manages product lifecycle. Includes custom closures for image thumbnails in lists and a `custom_html` field for image selection preview in the update form.
- **OrderCrudController**: Handles order management. Uses a custom Show view (`admin.orders.show`) for an invoice-like display.
- **ErrorLogCrudController**: Integrated observability that logs frontend errors (React runtime errors, performance issues) directly into the database.

---

## 🛠️ Engineering Hardening (Resilience)

### **7. Centralized API Gatekeeper**
Moved from dispersed, hardcoded API URLs to a single, robust source of truth.
- **Action**: Created/Standardized `axiosClient.js` with integrated **Observability**.
- **Result**: Every API failure (except 404s/401s) is now automatically reported to your admin error log for debugging.

### **8. Memory Leak Protection**
- **Action**: Implemented `AbortController` in all major data-fetching components (`Shop`, `ProductDetails`, `Orders`).
- **Result**: Prevents crashes and "ghost" network requests if a user navigates between pages very quickly.

### **9. Defensive UI & Error Boundaries**
- **Action**: Added **Null-Safety** (optional chaining) to product cards and the cart. Created a global **ErrorBoundary**.
- **Result**: If one component fails or data is missing, the whole app won't crash. Instead, it shows a friendly "Reload" button and logs the specific error for you.

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
- [x] Admin Middleware Integration
- [x] Secure Server-Side Price Fetching
- [x] Server-Side Total Recalculation
- [x] Cart Model Restoration
- [x] Automated Stock Restoration on Cancellation
- [x] Route-level Security Grouping
- [x] Centralized & Robust API Client
- [x] Memory Leak Protection (AbortController)
- [x] Defensive Rendering & Global Error Boundary

Your application is now significantly more "Production Ready", secure, and resilient to crashes.
