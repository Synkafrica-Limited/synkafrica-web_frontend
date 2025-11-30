# Business Onboarding — Frontend Implementation Guide

## Overview

This guide explains how to implement the vendor/business onboarding flow on the frontend and how it integrates with the SynkkAfrica backend. It describes API endpoints, expected request/response shapes, form structure, file upload handling, Cloudinary guidance, validation rules, and testing recommendations.

Target reader: frontend engineers implementing React/Next/React Native interfaces and automation/AI agents building the UI.

## Goals
- Allow a vendor to create a business record (basic details).
- Allow a vendor to upload verification documents and submit for verification.
- Allow a vendor to update profile (logo) and manage onboarding steps.
- Provide clear responses/errors to the user and the UI.

## Key Backend Endpoints (used by the frontend)

- `POST /api/business` — Create business (owner vendor)
  - Auth: JWT (Vendor)
  - Body: JSON `CreateBusinessDto` (see example below)
  - Response: Created business object

- `POST /api/business/onboard` — Onboard business (completes initial onboarding)
  - Auth: JWT (Vendor)
  - Body: `OnboardBusinessDto` (usually businessId and extra onboarding data)
  - Response: business with onboardingNextStep field or similar

- `POST /api/business/verification/submit` — Upload documents and submit verification
  - Auth: JWT (Vendor)
  - Content-Type: `multipart/form-data`
  - Form fields: `businessId` (string) and files under `documents` (multiple)
  - Response: updated business with documents array and verification status

- `POST /api/business/:id/documents` — Add a document record (alternative endpoint)
  - Auth: JWT (Vendor)
  - Body: JSON `UploadDocumentDto` if the frontend uploads files directly to Cloudinary first

- `GET /api/business/me` — Get current vendor's business (single object)
  - Auth: JWT (Vendor)
  - Response: single business object or 404 if none created

- `PATCH /api/business/profile` — Update profile (logo upload supported)
  - Auth: JWT (Vendor)
  - Content-Type: `multipart/form-data` or JSON (logo url)

Notes:
- All endpoints require JWT authorization. Include `Authorization: Bearer <token>` or use your API client wrapper with `auth: true` semantics.

## DTO / Example Request Shapes

Example `CreateBusinessDto` (JSON body):

```json
{
  "businessName": "Acme Car Rentals",
  "businessEmail": "info@acme.example",
  "businessPhone": "+2348010000000",
  "businessType": "CAR_RENTAL",
  "description": "Reliable cars",
  "address": "123 Main Street",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "website": "https://acme.example",
  "socialMedia": {}
}
```

Form data example for verification document upload (`multipart/form-data`):

- Field `businessId`: business ID string
- Files: `documents` (one or more files)

curl example (upload documents):

```bash
curl -X POST "https://api.synkkafrica.com/api/business/verification/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -F "businessId=your-business-id" \
  -F "documents=@/path/to/doc1.pdf" \
  -F "documents=@/path/to/doc2.jpg"
```

## Frontend Implementation Patterns

This section gives recommended UI flows, validation rules, and code patterns for a React/Next app.

1) Authentication
- Ensure a vendor is authenticated and has a valid JWT before showing onboarding pages.
- If `GET /api/business/me` returns 404, show a guided onboarding flow.

2) Onboarding Flow (recommended steps)
- Step 1: Basic details (Create business) — POST `/api/business`.
- Step 2: Business profile (address, contact, category, currency, etc.) — PATCH `/api/business/:id`.
- Step 3: Upload documents — POST `/api/business/verification/submit` (multi-file upload).
- Step 4: Submit verification — backend marks `verificationStatus` (PENDING) and admin reviews.

3) Forms and Validation
- Use client-side validation (e.g., `yup` or `zod`) to validate required fields before sending.
- Minimum required fields: `businessName`, `businessEmail` (valid email), `businessPhone`.
- Validate file types for documents (pdf, png, jpg) and size limit (e.g., max 10MB per file).

4) File Upload Strategy (recommended)

Option A — Frontend posts files directly to backend (simple):
- Pros: Simple implementation. Backend handles Cloudinary upload.
- Cons: Backend processes file uploads; higher network usage on the server.
- Implementation: POST multipart/form-data to `/api/business/verification/submit` with field `documents`.

Option B — Direct upload to Cloudinary (recommended for large scale):
- Flow:
  1. Frontend requests an upload signature/credentials endpoint if using private uploads (or uses unsigned presets).
  2. Frontend uploads files directly to Cloudinary using their SDK/REST.
  3. Cloudinary returns `secure_url`. Frontend sends `UploadDocumentDto` to backend: `{ documentUrl, documentType, documentName }` via `POST /api/business/:id/documents`.
- Pros: Offloads file traffic from backend, faster UX, resumable strategies.
- Cons: Slightly more complex; requires Cloudinary setup (unsigned or signed uploads).

Implementation notes for Option B:
- If using signed uploads, backend must provide an endpoint that returns a Cloudinary signature + timestamp. Keep credentials secret.
- Use Cloudinary `folder: synkkafrica/business-verification` to keep docs organized.

5) UX & Feedback
- Show progress bars for document uploads.
- After submission, display `verificationStatus` (PENDING/VERIFIED/REJECTED) from `GET /api/business/me` or dedicated verification endpoints.
- If 404 on `GET /api/business/me`, treat as "no business yet" and show start-onboarding CTA.

## Example React Components & Hooks

Minimal hook to fetch current business (aligns with backend `GET /api/business/me`):

```js
// hooks/useBusiness.js
import { useState, useEffect } from 'react';
import { api } from '@/lib/fetchClient';

export function useBusiness() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.get('/api/business/me', { auth: true });
        if (mounted) setBusiness(data || null);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  return { business, loading, error };
}
```

Example: Submit verification (files) — frontend posts form data to backend

```js
async function submitVerification(businessId, files) {
  const form = new FormData();
  form.append('businessId', businessId);
  files.forEach((f) => form.append('documents', f));

  // api.post should send Authorization header
  const res = await api.post('/api/business/verification/submit', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    auth: true,
  });
  return res;
}
```

If you use Cloudinary direct upload, instead: upload to Cloudinary, then POST `POST /api/business/:id/documents` with JSON body containing `documentUrl`.

## Error Handling & Edge Cases

- 401: Redirect to login and show message.
- 403: Show "Access denied" (not owner) message.
- 404 on `GET /api/business/me`: Show start onboarding UI.
- 413 / Too large files: Reject on client with size limit and show guidance.
- 5xx: Retryable — surface as "Server error, try again" and allow retry.

## Testing Recommendations

- Unit tests for form validation (yup/zod schemas).
- Integration tests for the onboarding flow (mock `api` to return success/failure states).
- E2E tests that:
  - Create a business via UI, upload docs, and assert verification status updated client-side.
  - Use a test Cloudinary account (or mock Cloudinary responses) to avoid real uploads in CI.

## Accessibility & UX

- Ensure forms are keyboard accessible and labeled.
- Provide descriptive alt text for uploaded document thumbnails/previews.
- Provide clear status messages for each onboarding step and file upload progress.

## Security & Privacy

- Never embed Cloudinary API secrets into frontend code.
- If using direct Cloudinary signed uploads, implement a small backend signing endpoint.
- Sanitize and validate document names before sending to backend.

## Example Minimal End-to-end Flow (summary)

1. User logs in — store JWT.
2. Frontend calls `GET /api/business/me`.
   - If 404 → show onboarding start.
3. User fills basic details → `POST /api/business`.
4. User uploads documents → either direct Cloudinary upload (recommended) or `POST /api/business/verification/submit`.
5. Backend sets `verificationStatus` to `PENDING` and returns updated business.
6. Frontend polls or shows status page indicating pending verification.

## Appendix — Quick Checklists

- Minimum client-side required fields: `businessName`, `businessEmail`, `businessPhone`.
- Document uploads: Accept `pdf`, `png`, `jpg`, max 10MB each.
- Use folder `synkkafrica/business-verification` on Cloudinary for organization.

---

If you want, I can also:
- produce React component templates (Form, DocumentUploader, StatusPage),
- add example `yup`/`zod` validation schemas,
- or implement a small Cloudinary-signing endpoint in NestJS.

File created: `docs/ONBOARD_BUSINESS_FRONTEND_GUIDE.md`
