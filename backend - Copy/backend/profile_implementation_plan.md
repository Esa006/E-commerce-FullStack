# Implement Amazon-style User Profile

To enable a more detailed "Amazon-like" profile, we need to split the generic `address` field into specific components and ensure all contact info is available.

## Proposed Changes

### Database
- **Create Migration**: Add the following columns to the `users` table:
    - `city` (string, nullable)
    - `state` (string, nullable)
    - `zip_code` (string, nullable)
    - `country` (string, nullable)
    - `address_line2` (string, nullable) -> Optional, keeping `address` as line 1.

### Model
#### [MODIFY] [User.php](file:///c:/xampp/htdocs/backend%20-%20Copy/backend/app/Models/User.php)
- Update `$fillable` array to include the new fields.

## Verification Plan

### Manual Verification
- Run `php artisan migrate`.
- Check `User` model logic (if any).
- (Optional) Verify via Tinker or Admin Panel if fields are editable.
