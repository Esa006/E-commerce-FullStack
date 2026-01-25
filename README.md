# 🛒 E-commerce FullStack Project (Premium Version)

A robust, production-ready E-commerce application built with a modern tech stack. This project features a powerful Laravel/Backpack backend and a high-performance React frontend, with a strong focus on **Engineering Hardening (Resilience)** and **Observability**.

---

## 🚀 Tech Stack

### **Frontend**
- **Framework:** React 19 (Vite)
- **Styling:** Bootstrap 5 (Utility-first approach)
- **State Management:** Redux Toolkit
- **Navigation:** React Router Dom
- **API Client:** Axios (Centralized & Hardened)
- **UI Components:** SweetAlert2, React Icons

### **Backend**
- **Framework:** Laravel 12
- **Admin Panel:** Backpack for Laravel (Premium CRUD Interface)
- **Database:** MySQL
- **Packages:** 
  - `spatie/laravel-backup`
  - `spatie/laravel-permission`
  - `laravel/sanctum` (for secure API auth)

---

## ✨ Key Features

### **1. Best Seller Selection**
- **Manual Control:** Admins can manually flag products as "Best Sellers" via the Backpack dashboard.
- **Frontend Display:** A dedicated section on the homepage highlights these products, driving sales for featured items.

### **2. Observability & Error Logging**
- **Client-Side Reporting:** Integrated `Observability.js` utility that captures frontend runtime errors and reports them directly to the backend database.
- **Performance Monitoring:** Tracks Largest Contentful Paint (LCP) and reports poor performance (>2.5s) to the admin panel.
- **Admin Dashboard:** A dedicated "Error Logs" CRUD in Backpack for developers to monitor and fix production issues.

### **3. Smart Inventory Management**
- **Stock Restoration:** When an admin cancels a 'pending' or 'confirmed' order, the system **automatically restores product stock**.
- **Low Stock Alerts:** Visual indicators in the admin panel and frontend for items with low inventory.

### **4. Engineering Hardening (Resilience)**
- **Memory Leak Protection:** Uses `AbortController` in all data-fetching hooks to prevent crashes during rapid navigation.
- **Defensive Rendering:** Implemented "Null-Safety" using optional chaining (`?.`) across the entire frontend.
- **Global Error Boundaries:** If a component fails, the app shows a friendly fallback UI rather than crashing the entire page.

### **5. Advanced Image Handling**
- **Hybrid Storage:** Custom Laravel Accessors handle both local storage paths and absolute URLs seamlessly.
- **Admin Previews:** Real-time image selection previews within the Backpack update forms.

---

## 🛠️ Installation & Setup

### **Backend Setup**
1. Navigate to `/backend`:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
2. Configure your database in `.env`.
3. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
4. Start the server:
   ```bash
   php artisan serve
   ```

### **Frontend Setup**
1. Navigate to `/Frontend`:
   ```bash
   npm install
   npm run dev
   ```

---

## 🛡️ Special Configurations
- **SSL Fix:** This project includes a local `cacert.pem` for PHP environments (XAMPP) that struggle with curl/SSL verification.
- **CORS:** Configured for seamless communication between the React dev server (port 5173) and Laravel.

---

## 👨‍💻 Developer Notes
This project is designed to be **Production Ready**. Every API failure is logged, every memory leak is guarded, and the UI is built to be resilient against missing data.
