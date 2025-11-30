# SYNKKAFRICA — Vendor Onboarding Refactor Specifications

Document Version: 1.0
Author: SynkkAfrica Engineering
Date: 2025-11-29

## Executive Summary

This document defines the exact frontend and backend contract for vendor onboarding to avoid DTO mismatches. The frontend must send only the fields the backend accepts during creation; address/location metadata belongs in the profile update.

## Frontend Requirements

1. Create Business
   - Endpoint: `POST /api/business/onboard` (or `POST /api/business` if your backend uses that route)
   - Payload (only):
     - `businessName` (string, required)
     - `businessEmail` (string, required)
     - `phoneNumber` (string, required)  // map from frontend `businessPhone`
     - `businessType` (enum: `CAR_RENTAL|RESORT|FINE_DINING|CONVENIENCE_SERVICE|OTHER`)
     - `description` (optional)
     - `website` (optional — omit if empty)
      - Include when available: `address`, `city`, `state`, `country`, `postalCode`, `latitude`, `longitude`

2. Update Profile
   - Endpoint: `PATCH /api/business/:id`
   - Payload: profile fields only (address, city, state, country, postalCode, latitude, longitude). NOTE: when address/location is supplied during onboarding it may be included in the create request (see Flow below). Use PATCH for later profile edits or retries.

3. Flow
   - Call `POST /api/business/onboard` to create business. Include address/location fields in this request when present on the onboarding form (Location step) so address and geo are persisted in a single call.
  - Merge/update `BusinessContext` with the returned/known profile fields so the new address appears across the dashboard without a manual reload.
  - Do not call `POST /api/business/onboard` a second time for completion. Use `PATCH /api/business/:id` for subsequent profile edits or retries.

4. Context
   - After successful creation, set `BusinessContext.setBusiness()` with a normalized business object so other pages can pick it up immediately.

## Cloudinary Direct Upload (Frontend)

- Environment variables:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

- Use `src/lib/cloudinary.js` helper for unsigned uploads (upload preset).
- Upload files directly from the browser and then POST the returned URLs to the backend at `POST /api/business/:id/documents` (or `POST /api/business/:id/verification` if your backend accepts JSON with document URLs).

## Onboarding Flow (create + immediate profile update)

When the user submits the full onboarding form and the form contains address/location data (from the Location step or the map), the frontend should perform the following sequence:

1. POST `/api/business/onboard` — create business. Payload (create-only):

```json
{
   "businessName": "...",
   "businessEmail": "...",
   "phoneNumber": "...", // map from frontend businessPhone
   "businessType": "RESORT",
   "description": "...",
   "website": "...", // omit if empty
   "address": "188 Egbe Rd, Orioke St",
   "city": "Ejigbo",
   "state": "Lagos",
   "country": "Nigeria",
   "postalCode": "102214",
   "latitude": 6.595,
   "longitude": 3.292
}
```

2. After create succeeds, call `BusinessContext.setBusiness()` (or merge into the existing context) with the normalized business object so the dashboard, verification page, and profile show the new address immediately.

Notes:
- The address/profile PATCH is considered a separate, idempotent step. If it fails, the creation still succeeded; surface an inline warning and allow the user to retry.
- Do not include address fields in the initial create payload unless your backend contract explicitly requires them; prefer the create + patch sequence above.

## Backend Requirements

- `CreateBusinessDto` should accept address/location fields when the frontend includes them during onboarding.
- Rename or accept `phoneNumber` as the canonical field.
- If a `complete onboarding` route is needed, use a dedicated endpoint (e.g. `POST /business/:id/complete`) — do NOT reuse `/business/onboard` for both creation and completion.

## Quick Checklist for Engineers

- [ ] Ensure frontend uses `phoneNumber` on create.
- [ ] Remove duplicate calls to `/business/onboard`.
- [ ] Keep address/geo in `PATCH /api/business/:id` only.
- [ ] Add Cloudinary unsigned direct upload helper and document env vars.
- [ ] Use `BusinessContext.setBusiness()` after create to update UI state.
 - [ ] If onboarding form contains address/location, PATCH `/api/business/:id` immediately after create and merge the profile into `BusinessContext`.
 - [ ] Ensure onboarding UI blocks completion until required fields for create are valid (businessName, businessEmail, businessPhone, businessType). Address may be optional but if provided it will be saved immediately via PATCH.

---

This file is intended for automated code-modifying assistants to follow exactly when refactoring the onboarding flow. Align both the frontend hook `useOnboardVendor` and the backend DTOs to this contract before deploying.
