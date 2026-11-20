# Security Specification — Omar Cell

## Data Invariants
1. All storefront collections (`products`, `categories`, `services`, `gallery`, `config/shopInfo`, `config/adminMeta`) are publicly readable (`get` and `list` allowed) so shoppers can browse without authentication.
2. All writes (`create`, `update`, `delete`) across Firestore and Firebase Storage are strictly restricted to the authenticated shop owner account (`request.auth != null && request.auth.token.email == "admin@omarcell.app"`).
3. Every document write validates strict schema keys (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly` on update), bounded string lengths, bounded array sizes, and valid document IDs (`^[a-zA-Z0-9_-]+$`).
4. Default-deny catch-all rule (`match /{document=**} { allow read, write: if false; }`) blocks any undefined path.

## Dirty Dozen Adversarial Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated `create` on `/products/p1` -> Denied (`isAdmin()` false).
2. Non-admin authenticated user (`other@example.com`) `update` on `/products/p1` -> Denied (`token.email != "admin@omarcell.app"`).
3. Unauthenticated `delete` on `/categories/iphone` -> Denied.
4. Unauthenticated `write` on `/config/adminMeta` to reset setup state -> Denied.
5. Unauthenticated `write` on `/config/shopInfo` to hijack WhatsApp number -> Denied.
6. Admin `create` on `/products/p1` with an extra shadow field `isVerified: true` -> Denied (`hasOnly` rejects unknown key).
7. Admin `create` on `/products/bad$id!` with invalid path characters -> Denied (`isValidId` fails).
8. Admin `create` on `/products/p1` with negative `price: -50` -> Denied (`price >= 0` fails).
9. Admin `create` on `/products/p1` with `condition: "Refurbished"` (outside `['New', 'Used']`) -> Denied.
10. Admin `create` on `/products/p1` with `images` array > 10 items -> Denied (bounded array guard).
11. Admin `update` on `/products/p1` attempting to mutate `createdAt` -> Denied (`incoming().createdAt == existing().createdAt`).
12. Unauthenticated write to undefined collection `/secret/doc1` -> Denied (global catch-all).
