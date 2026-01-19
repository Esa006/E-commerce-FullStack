# Fix Documentation

## 1. Image Array Handling
**Issue:** Product images were failing to load because the application was not correctly handling different data formats from the backend (sometimes arrays, sometimes JSON strings).
**Fix:** 
- Created `src/utils/imageUtils.js` to standardize image parsing.
- Updated `ProductCard.jsx`, `Shop.jsx`, and `ProductDetails.jsx` to use this utility.
- Fixed a broken image URL in `Shop.jsx`.

## 2. Order Authentication Error
**Issue:** Users could not place orders because the checkout process was checking for an `admin_token` instead of the logged-in user's `ACCESS_TOKEN`.
**Fix:**
- Updated `Checkout.jsx` to use `ACCESS_TOKEN` for authorization headers.
