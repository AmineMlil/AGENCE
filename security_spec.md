# Security Specification: NCRM Agency Management

## 1. Data Invariants
- An Agency must belong to a valid City and Client.
- Maintenance status (isMP) can only be toggled by authenticated agents or admins.
- User profiles can only be read by the owner or an admin.
- Only admins can modify the global cities and clients lists in metadata.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

### Agency Collection (`/agencies/{id}`)
1. **Identity Spoofing**: User `A` tries to create an agency with `updatedBy: "UserB"`. (Expected: Denied)
2. **Resource Poisoning**: Create an agency with a 2MB string in the `name` field. (Expected: Denied)
3. **ID Poisoning**: Attempting to GET `/agencies/..%2F..%2Fsys_config`. (Expected: Denied)
4. **State Shortcutting**: Updating `isMP` while trying to change the `client` (immutable field). (Expected: Denied)
5. **Unauthorized Write**: Non-authenticated user tries to write to `/agencies/test`. (Expected: Denied)
6. **Query Scraping**: `list` agencies without specifying any filters (if query enforcement is on). (Expected: Denied based on specific rules)

### User Collection (`/users/{id}`)
7. **PII Leak**: User `A` tries to GET `/users/UserB`. (Expected: Denied)
8. **Privilege Escalation**: User `A` tries to UPDATE `/users/UserA` setting `role: "admin"`. (Expected: Denied)
9. **Identity Theft**: User `A` creates a profile with `email: "admin@ncr-maroc.com"`. (Expected: Denied)

### Metadata Collection (`/metadata/config`)
10. **Unauthorized Config**: Non-admin user tries to UPDATE `cities` list. (Expected: Denied)
11. **Metadata Deletion**: Non-admin user tries to DELETE `/metadata/config`. (Expected: Denied)

### Global
12. **Batch Atomicity**: Creating an agency without a corresponding log (if atomicity is required).

## 3. Test Runner Logic (Draft)
A `firestore.rules.test.ts` would verify these.
