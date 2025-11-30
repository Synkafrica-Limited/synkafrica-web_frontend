# Frontend Audit & Synchronization Plan
## SynkkAfrica Vendor Dashboard - Backend API Alignment

### AUDIT SUMMARY

After reviewing the codebase, here are the findings and required updates:

## ✅ ALREADY CORRECT (No Changes Needed)

### 1. Business Service (`services/business.service.js`)
- ✅ Correctly uses `/api/business` endpoints
- ✅ Proper authentication with `{ auth: true }`
- ✅ Handles array/object normalization
- ✅ Verification endpoints properly configured

### 2. Verification Service (`services/verification.service.js`)
- ✅ Comprehensive verification flow
- ✅ FormData handling for file uploads
- ✅ Fallback logic for missing endpoints
- ✅ Status mapping (not_started, pending_review, approved, rejected)

### 3. Bookings Hook (`hooks/business/useVendorBookings.js`)
- ✅ Recently updated to use `/api/bookings/vendor`
- ✅ Proper dependency management (fixed infinite loop)
- ✅ Handles different response structures

### 4. Dashboard Service (`services/dashboardService.js`)
- ✅ Uses correct vendor endpoints:
  - `/api/business/dashboard/stats`
  - `/api/dashboard/vendor/revenue/chart`
  - `/api/dashboard/vendor/bookings/stats`

### 5. Business Hook (`hooks/business/useBusiness.js`)
- ✅ Uses `/api/business/` endpoint
- ✅ Proper error handling for 404 (no business setup yet)
- ✅ Token-based authentication

## 🔧 NEEDS UPDATES

### 1. Transactions Hook (`hooks/business/useVendorTransactions.js`)
**Issue**: May not be using the correct vendor endpoint
**Required**: Ensure it uses `/api/transactions/vendor`

### 2. Vendor Stats Hook (`hooks/business/useVendorStats.js`)
**Issue**: Need to verify endpoint alignment
**Required**: Check if it uses updated dashboard endpoints

### 3. Toast Provider Usage
**Status**: Partially fixed
**Remaining**: Need to audit all pages for correct `useToast` import

### 4. Verification Status Display
**Issue**: Need to ensure UI matches backend status values
**Required**: Audit all verification-related components

### 5. Business Onboarding Flow
**Issue**: Need to verify form field mapping
**Required**: Check onboarding pages match backend DTO

## 📋 ACTION ITEMS

### Priority 1: Critical API Fixes
1. ✅ Fix useVendorBookings (COMPLETED)
2. ⏳ Audit useVendorTransactions
3. ⏳ Verify useVendorStats endpoints
4. ⏳ Check business onboarding form fields

### Priority 2: UI/UX Improvements
1. ⏳ Verification status badges
2. ⏳ Empty states for no business
3. ⏳ Loading skeletons
4. ⏳ Error messages

### Priority 3: Code Quality
1. ✅ Remove debug overlays (COMPLETED)
2. ✅ Fix Toast imports (MOSTLY COMPLETED)
3. ⏳ Deduplicate API calls
4. ⏳ Add proper TypeScript types (if applicable)

## 🎯 NEXT STEPS

1. Review useVendorTransactions implementation
2. Audit all verification UI components
3. Check business onboarding form mapping
4. Test all critical flows end-to-end
5. Document any remaining backend/frontend mismatches
