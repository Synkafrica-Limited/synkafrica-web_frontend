# Business Verification API Specification

## Overview
This document specifies the API endpoints needed for the business verification system. The frontend is already built and ready to integrate with these endpoints.

---

## 🔴 Priority 1: Critical Endpoints

### 1. Submit Verification

**Endpoint:** `POST /api/business/{businessId}/verification`

**Request:**
- Content-Type: `multipart/form-data`
- Authorization: `Bearer {token}`

**Body (FormData):**
```javascript
{
  businessType: string,           // Required: "Hotel", "Restaurant", "Car Rental", etc.
  companyName: string,            // Required: Registered business name
  registrationNumber: string,     // Required: RC Number or Business Number
  bankName: string,               // Required: Bank name
  accountName: string,            // Required: Account holder name
  accountNumber: string,          // Required: 10-digit account number
  business_certificate: File      // Required: PDF/JPG/PNG, max 5MB
}
```

**Response (201 Created):**
```javascript
{
  id: "uuid",
  businessId: "uuid",
  status: "pending",              // "pending" | "verified" | "rejected"
  progress: 50,                   // 0-100
  submittedAt: "2025-11-30T07:00:00Z",
  reviewedAt: null,
  rejectionReason: null,
  documents: [
    {
      id: "uuid",
      url: "https://cloudinary.com/...",
      type: "certificate",
      uploadedAt: "2025-11-30T07:00:00Z"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data or missing required fields
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Business not found
- `409 Conflict` - Verification already submitted and pending

---

### 2. Get Verification Status

**Endpoint:** `GET /api/business/{businessId}/verification`

**Request:**
- Authorization: `Bearer {token}`

**Response (200 OK):**
```javascript
{
  id: "uuid",
  businessId: "uuid",
  status: "pending",              // "not_started" | "pending" | "verified" | "rejected"
  progress: 50,                   // 0-100
  submittedAt: "2025-11-30T07:00:00Z",
  reviewedAt: null,               // timestamp when reviewed
  rejectionReason: null,          // string if rejected
  documents: [
    {
      id: "uuid",
      url: "https://cloudinary.com/...",
      type: "certificate",
      uploadedAt: "2025-11-30T07:00:00Z"
    }
  ],
  verificationData: {
    businessType: "Car Rental",
    companyName: "SOLA Limited",
    registrationNumber: "RC123456",
    bankName: "Access Bank",
    accountName: "SOLA Limited",
    accountNumber: "0123456789"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Business or verification not found (return status: "not_started")

---

### 3. Update/Resubmit Verification

**Endpoint:** `PATCH /api/business/{businessId}/verification`

**Request:**
- Content-Type: `multipart/form-data`
- Authorization: `Bearer {token}`

**Body (FormData):** Same as POST, all fields optional (only send changed fields)

**Response (200 OK):** Same structure as POST response

**Use Case:** For resubmitting after rejection or updating pending verification

---

### 4. Enhanced Business Profile Endpoint

**Endpoint:** `PATCH /api/business/{businessId}`

**Current Issue:** Only returns location fields, doesn't return verification/bank data

**Required Changes:**

**Request (FormData):**
```javascript
{
  // Existing fields
  businessName: string,
  businessEmail: string,
  businessPhone: string,
  businessType: string,
  description: string,
  logo: File,
  
  // Location fields
  address: string,
  city: string,
  state: string,
  country: string,
  
  // NEW: Verification fields (should be stored and returned)
  registrationNumber: string,
  certificate: File,              // or URL if already uploaded
  verificationStatus: string,     // "not_started" | "pending" | "verified" | "rejected"
  isVerified: boolean,
  
  // NEW: Bank details
  bankName: string,
  accountName: string,
  accountNumber: string,
  
  // NEW: Additional fields
  website: string,
  availability: string,
  phoneNumber2: string
}
```

**Response (200 OK):**
```javascript
{
  id: "uuid",
  ownerId: "uuid",
  businessName: "SOLA Limited",
  businessEmail: "info@biz.com",
  businessPhone: "+234084342323245",
  businessType: "RESORT",
  description: "...",
  logo: "https://cloudinary.com/...",
  
  // Location
  address: "123 Main St",         // ❌ Currently returns null
  city: "Lagos",                  // ❌ Currently returns null
  state: "Lagos",                 // ❌ Currently returns null
  country: "Nigeria",             // ❌ Currently returns null
  latitude: 6.5244,
  longitude: 3.3792,
  
  // ✅ NEW: Verification fields
  registrationNumber: "RC123456",
  certificate: "https://cloudinary.com/...",
  verificationStatus: "pending",
  isVerified: false,
  
  // ✅ NEW: Bank details
  bankName: "Access Bank",
  accountName: "SOLA Limited",
  accountNumber: "0123456789",
  
  // ✅ NEW: Additional fields
  website: "https://example.com",
  availability: "24/7",
  phoneNumber2: "+234081234567",
  
  createdAt: "2025-11-29T...",
  updatedAt: "2025-11-30T..."
}
```

---

## 🟡 Priority 2: Important Enhancements

### 5. Verification History

**Endpoint:** `GET /api/business/{businessId}/verification/history`

**Response (200 OK):**
```javascript
[
  {
    id: "uuid",
    status: "rejected",
    submittedAt: "2025-11-28T...",
    reviewedAt: "2025-11-29T...",
    rejectionReason: "Invalid registration number",
    reviewedBy: "admin@synkkafrica.com"
  },
  {
    id: "uuid",
    status: "pending",
    submittedAt: "2025-11-30T...",
    reviewedAt: null,
    rejectionReason: null,
    reviewedBy: null
  }
]
```

---

### 6. Cancel Verification

**Endpoint:** `DELETE /api/business/{businessId}/verification`

**Use Case:** Cancel pending verification to submit new one

**Response (204 No Content)**

---

## 🟢 Priority 3: Admin Features (Future)

### 7. List Pending Verifications (Admin)

**Endpoint:** `GET /api/admin/verifications?status=pending`

**Response:**
```javascript
{
  data: [
    {
      id: "uuid",
      businessId: "uuid",
      businessName: "SOLA Limited",
      status: "pending",
      submittedAt: "2025-11-30T...",
      documents: [...]
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 45
  }
}
```

---

### 8. Approve Verification (Admin)

**Endpoint:** `PATCH /api/admin/verifications/{verificationId}/approve`

**Request:**
```javascript
{
  notes: "All documents verified"  // Optional
}
```

**Response (200 OK):**
```javascript
{
  id: "uuid",
  status: "verified",
  reviewedAt: "2025-11-30T...",
  reviewedBy: "admin@synkkafrica.com"
}
```

---

### 9. Reject Verification (Admin)

**Endpoint:** `PATCH /api/admin/verifications/{verificationId}/reject`

**Request:**
```javascript
{
  rejectionReason: "Registration number does not match certificate"  // Required
}
```

**Response (200 OK):**
```javascript
{
  id: "uuid",
  status: "rejected",
  reviewedAt: "2025-11-30T...",
  reviewedBy: "admin@synkkafrica.com",
  rejectionReason: "Registration number does not match certificate"
}
```

---

## Database Schema Recommendations

### Verification Table
```sql
CREATE TABLE business_verifications (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  status VARCHAR(20) NOT NULL,  -- 'pending', 'verified', 'rejected'
  business_type VARCHAR(100),
  company_name VARCHAR(255),
  registration_number VARCHAR(100),
  bank_name VARCHAR(100),
  account_name VARCHAR(255),
  account_number VARCHAR(20),
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_documents (
  id UUID PRIMARY KEY,
  verification_id UUID REFERENCES business_verifications(id),
  type VARCHAR(50),  -- 'certificate', 'license', etc.
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### Business Table Updates
```sql
ALTER TABLE businesses ADD COLUMN registration_number VARCHAR(100);
ALTER TABLE businesses ADD COLUMN certificate_url TEXT;
ALTER TABLE businesses ADD COLUMN verification_status VARCHAR(20) DEFAULT 'not_started';
ALTER TABLE businesses ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE businesses ADD COLUMN bank_name VARCHAR(100);
ALTER TABLE businesses ADD COLUMN account_name VARCHAR(255);
ALTER TABLE businesses ADD COLUMN account_number VARCHAR(20);
ALTER TABLE businesses ADD COLUMN website VARCHAR(255);
ALTER TABLE businesses ADD COLUMN availability VARCHAR(100);
ALTER TABLE businesses ADD COLUMN phone_number_2 VARCHAR(20);
```

---

## File Upload Requirements

### Cloudinary Configuration
- Accept files via `multipart/form-data`
- Upload to Cloudinary on backend
- Return Cloudinary URL in response
- Store URL in database

### Validation
- **Allowed types:** PDF, JPG, JPEG, PNG
- **Max size:** 5MB
- **Naming:** `{businessId}_certificate_{timestamp}.{ext}`

---

## Webhooks/Notifications (Optional)

### Email Notifications
Send emails on status changes:
- ✅ Verification submitted → "We received your verification"
- ✅ Verification approved → "Congratulations! You're verified"
- ❌ Verification rejected → "Action required: Verification rejected"

---

## Testing Checklist

- [ ] POST verification with valid data
- [ ] POST verification with invalid data (400)
- [ ] POST verification without auth (401)
- [ ] POST verification for non-existent business (404)
- [ ] GET verification status (all states)
- [ ] PATCH verification (resubmit)
- [ ] DELETE verification (cancel)
- [ ] File upload to Cloudinary
- [ ] PATCH business returns all fields
- [ ] Admin approve/reject flow

---

## Frontend Integration Status

✅ **Ready to integrate** - Frontend is fully built with:
- Multi-step verification form
- File upload handling
- All status states (pending, verified, rejected)
- Rejection reason display
- Resubmission flow
- Document preview
- Graceful fallback to business profile endpoint

**When backend is ready:** Simply implement the endpoints above and the frontend will work seamlessly!
