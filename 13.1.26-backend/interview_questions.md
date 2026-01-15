# Laravel & React Full Stack Interview Questions
(Prepared based on your specific project stack: Laravel API + React Frontend)

This document contains a comprehensive list of interview questions, ranging from basic to advanced, specifically tailored for a Laravel Developer.

---

## 1. Laravel Basics (Database & Routing)

### Q1: What is Eloquent ORM?
**Answer:** Eloquent ORM (Object-Relational Mapping) is Laravel's built-in database interacting feature. It allows you to work with your database using PHP syntax (Classes & Methods) instead of writing raw SQL code.
- **Example:** `Product::all()` instead of `SELECT * FROM products`.

### Q2: What is the difference between `find($id)` and `findOrFail($id)`?
**Answer:**
- `find($id)`: Returns `null` if the record is not found. You must manually check if it exists.
- `findOrFail($id)`: Automatically throws a **404 ModelNotFoundException** if the record is not found, stopping execution immediately.

### Q3: Where do route parameters (like `$id`) come from in a Controller?
**Answer:** They come from the URL defined in your `routes/api.php` file.
- **Route:** `Route::get('/products/{id}', ...)`
- **URL:** `site.com/api/products/5`
- **Controller:** `public function show($id)` receives `5`.

### Q4: What is `$fillable` in a Model and why do we need it?
**Answer:** `$fillable` is a security property in a Model that prevents **Mass Assignment** vulnerabilities. It defines an array of database columns that are allowed to be mass-assigned (e.g., via `Product::create($request->all())`).
- It stops data injection attacks where users try to modify protected columns like `is_admin`.

### Q5: What does the HTTP Status Code `201` mean?
**Answer:** `201 Created`. It is the standard success response code when a new resource has been successfully created (e.g., after a POST request to add a product).

---

## 2. API & Requests

### Q6: What happens if Laravel Validation fails?
**Answer:**
1.  Code execution stops immediately.
2.  Laravel automatically returns a **422 Unprocessable Entity** HTTP status.
3.  It returns a JSON object with error messages (e.g., `{"message": "The name field is required."}`).

### Q7: Which HTTP methods should be used for Create, Read, Update, and Delete (CRUD)?
**Answer:**
- **Create:** `POST`
- **Read:** `GET`
- **Update (Full):** `PUT`
- **Update (Partial):** `PATCH`
- **Delete:** `DELETE`

### Q8: How do you handle file uploads in an API (React to Laravel)?
**Answer:**
- **Frontend (React):** You MUST use the `FormData` object. JSON (body) cannot carry binary file data.
- **Backend (Laravel):** Access the file using `$request->file('image')`.
- **Note for Updates:** When updating a file via PUT, browsers often fail. The standard workaround is to use a `POST` request and add a field `_method: 'PUT'` in the FormData.

### Q9: What does `$request->file('image')->store('products', 'public')` do?
**Answer:**
- It uploads the file to the disk named `'public'` (configured in `config/filesystems.php`, usually pointing to `storage/app/public`).
- It places the file inside a folder named `'products'`.
- It returns the file path of the saved image.
- *Note:* You must run `php artisan storage:link` to make these files accessible from the browser.

---

## 3. React Frontend (Bonus Questions)

### Q10: What is the difference between `useEffect` and `useState`?
**Answer:**
- **`useState`**: Used to **store** data that changes (state). Updating it triggers a re-render (updates the proper UI).
- **`useEffect`**: Used to handle **side effects** like fetching data from an API when the component loads.

### Q11: Why do we use `axios` instead of `fetch` (optional but common)?
**Answer:**
- `axios` simplifies the process: it automatically transforms JSON data (no need for `response.json()`), handles errors better (throws errors on 4xx/5xx status), and has better support for older browsers.

---

## 4. Advanced / Conceptual (Important for Seniors)

### Q12: What is a "Migration" in Laravel?
**Answer:** Migrations are like version control for your database. They allow you to define and share the application's database schema definition. They make it easy to modify the database structure (add tables, columns) across different environments (local, staging, production) without manually running SQL commands.

### Q13: Explain "One-to-Many" Relationship.
**Answer:**
- A relationship where one model owns multiple child models.
- **Example:** One `Category` has many `Products`.
- **Code:**
  - In Category Model: `public function products() { return $this->hasMany(Product::class); }`
  - In Product Model: `public function category() { return $this->belongsTo(Category::class); }`

### Q14: What is Middleware?
**Answer:** Middleware provides a mechanism for inspecting and filtering HTTP requests entering your application.
- **Common Use Case:** Authentication. E.g., The `auth:sanctum` middleware checks if a user is logged in before letting them access the `/admin/products` route. If not logged in, it blocks the request.

### Q15: What is "Eager Loading" vs "Lazy Loading"? (N+1 Problem)
**Answer:**
- **Lazy Loading (Default):** Relationships are loaded only when you access them. If you loop through 100 products and access their category, it runs 101 queries (1 for products, 100 for categories). This is bad for performance.
- **Eager Loading:** You load the relationships *at the same time* as the main model using `with()`.
  - **Code:** `Product::with('category')->get();`
  - This runs only 2 queries total, regardless of how many products there are.

---

## 5. Security (Critical)

### Q16: How does Laravel protect against SQL Injection?
**Answer:** Laravel's Eloquent ORM and Query Builder automatically use PDO parameter binding. This means user input is treated as data, not executable code, making SQL injection attacks impossible if used correctly.

### Q17: What is CSRF and how do APIs handle it?
**Answer:**
- **CSRF (Cross-Site Request Forgery):** An attack where unauthorized commands are transmitted from a user that the web application trusts.
- **Handling in APIs:** APIs (like yours using `api.php`) usually don't use CSRF tokens because they are stateless. Instead, they use Token Authentication (like Laravel Sanctum or Passport) to verify the user.
