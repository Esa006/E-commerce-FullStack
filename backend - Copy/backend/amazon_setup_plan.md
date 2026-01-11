# Implement Amazon-style Checkout & Order Details

To support a detailed checkout and order review page ("check page detail"), we need to store granular address information with every order and provide an API to retrieve it.

## Proposed Changes

### Database
- **Create Table**: `addresses`
    - `user_id` (FK)
    - `name` (e.g., "Home", "Work")
    - `address_line1`, `address_line2`, `city`, `state`, `zip_code`, `country`
    - `is_default` (boolean)
- **Modify Table**: `orders` (Snapshot address at time of purchase)
    - Add `address_line1`, `address_line2`, `city`, `state`, `zip_code`, `country`.

### Models
#### [NEW] [Address.php](file:///c:/xampp/htdocs/backend - Copy/backend/app/Models/Address.php)
- Define `belongsTo` User relationship.

#### [MODIFY] [User.php](file:///c:/xampp/htdocs/backend - Copy/backend/app/Models/User.php)
- Add `addresses` (hasMany) relationship.

#### [MODIFY] [Order.php](file:///c:/xampp/htdocs/backend - Copy/backend/app/Models/Order.php)
- Update `$fillable` for snapshot fields.


### Controllers
#### [MODIFY] [OrderController.php](file:///c:/xampp/htdocs/backend%20-%20Copy/backend/app/Http/Controllers/OrderController.php)
- **`placeOrder`**: Update validation and creation logic to accept and save new address fields.
- **`showOrderItems`**: Implement this missing method (currently defined in routes but missing in controller) to return:
    - Order details (ID, status, total).
    - Full shipping address.
    - List of items with product details.

## Verification
- **Checkout**: Place an order via Postman or Frontend (if available) with full address.
- **Order Details**: Call `GET /api/orders/{id}/items` and verify full details are returned.
