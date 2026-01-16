# Search, Pagination & Observability Documentation

This document explains the architecture and implementation of the backend-driven systems.

---

## 1. Backend: Search & Pagination Logic
Located in: [ProductController.php](file:///c:/Users/Admin/Downloads/E-commerce-FullStack/13.1.26-backend/app/Http/Controllers/ProductController.php)

### Search Engine
The backend implements a case-insensitive partial match on product names and descriptions.
- **SQL Implementation**: Uses `where(function($q) { ... })` to group search conditions.

### Pagination Structure (The "12" Logic)
We chose **12 items per page** because it provides perfect visual alignment for multiple screen sizes:
- **Desktop (4 columns)**: 12 / 4 = 3 full rows.
- **Tablets (3 columns)**: 12 / 3 = 4 full rows.
- **Mobile (2 columns)**: 12 / 2 = 6 full rows.

---

## 2. Frontend: Global Search Bar
Located in: [SearchBar.jsx](file:///c:/Users/Admin/Downloads/E-commerce-FullStack/13.1.26Frontend/src/components/SearchBar.jsx)

### Debouncing Logic
To prevent hitting the database on every single keystroke, we use a **500ms debounce**.

---

## 3. Production Observability & Security

We have implemented a high-grade monitoring and hardening system to ensure the app stays stable and secure.

### 🛑 Error Capturing (React & JS)
- **Global Catch**: All uncaught JavaScript errors (`window.onerror`) and Promise rejections are automatically reported.
- **React Error Boundary**: If a component crashes, it shows a professional "Something went wrong" UI and logs the stack trace.
- **Performance Vitals**: Automatically captures Poor performance (LCP > 2.5s) and reports it to the admin.

### 🛑 Administrative Dashboard (Backpack)
The system is fully integrated into the **Laravel Backpack** admin panel:
- **Location**: Admin Sidebar -> **"Error Logs"**.
- **Features**: 
    - View Structured Logs (IP, User Agent, Stack Trace).
    - Color-coded severity (Performance vs Runtime Errors).
    - Performance monitoring (Web Vitals) integrated into the list.

### 🛑 Security Hardening
Located in: `SecurityHeadersMiddleware.php`
- `Strict-Transport-Security`: Enforces HTTPS.
- `X-Frame-Options: DENY`: Prevents Clickjacking.
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing.
- **Rate Limiting**: Report endpoint is throttled (5 req/min) to prevent log flooding.

---

### Key Files for Review
- [ErrorLogCrudController.php](file:///c:/Users/Admin/Downloads/E-commerce-FullStack/13.1.26-backend/app/Http/Controllers/Admin/ErrorLogCrudController.php) (Backpack Logic)
- [SecurityHeadersMiddleware.php](file:///c:/Users/Admin/Downloads/E-commerce-FullStack/13.1.26-backend/app/Http/Middleware/SecurityHeadersMiddleware.php) (Security Layer)
- [Observability.js](file:///c:/Users/Admin/Downloads/E-commerce-FullStack/13.1.26Frontend/src/utils/Observability.js) (Frontend Monitor)
