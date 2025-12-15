// hooks/useOnboardVendor.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';
import { api } from '@/lib/fetchClient';
import { useToast } from '@/components/ui/ToastProvider';
import { useBusiness } from '@/context/BusinessContext';
import { handleApiError } from '@/utils/errorParser';

export function useOnboardVendor() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Try to get BusinessContext if available (may not be present during onboarding pages)
  // Try to get BusinessContext if available (may not be present during onboarding pages)
  const businessCtx = useBusiness();

  // split out fields for creating a business vs additional onboarding metadata
  const pickCreateFields = (data) => {
    // Map frontend-friendly values to backend enum
    const mapBusinessType = (val) => {
      if (!val) return undefined;
      const v = String(val).trim().toLowerCase();
      if (v.includes('car')) return 'CAR_RENTAL';
      if (v.includes('resort')) return 'RESORT';
      if (v.includes('fine') || v.includes('dining')) return 'FINE_DINING';
      if (v.includes('convenience') || v.includes('convenience store')) return 'CONVENIENCE_SERVICE';
      return 'OTHER';
    };

    const payload = {
      businessName: data.businessName || data.companyName || '',
      businessEmail: data.businessEmail || data.businessEmail || '',
      // backend expects `phoneNumber` (not `businessPhone`)
      phoneNumber: data.businessPhone || data.phoneNumber || '',
      businessType: mapBusinessType(data.businessType),
      description: data.description || ''
    };

    // only include website if non-empty and allowed by backend
    if (data.website && String(data.website).trim() !== '') payload.website = data.website;

    // include address/location in the create payload when provided
    if (data.address) payload.address = data.address;
    if (data.city) payload.city = data.city;
    if (data.state) payload.state = data.state;
    if (data.country) payload.country = data.country;
    if (data.postalCode) payload.postalCode = data.postalCode;
    if (typeof data.latitude !== 'undefined' && data.latitude !== null) payload.latitude = data.latitude;
    if (typeof data.longitude !== 'undefined' && data.longitude !== null) payload.longitude = data.longitude;

    return payload;
  };

  // profile fields are now included in create payload; explicit pickProfileFields removed

  const submitOnboarding = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = authService.getAccessToken();
      if (!token) {
        const msg = 'Authentication required. Please log in again.';
        console.error('[useOnboardVendor] No access token');
        addToast({ message: msg, type: 'error' });
        setError(msg);
        setLoading(false);
        return null;
      }

      // 1) Create business (basic fields)
      const createPayload = pickCreateFields(formData);
      console.debug('[useOnboardVendor] createPayload:', createPayload);

      let created = null;
      try {
        created = await api.post('/api/business/onboard', createPayload, { auth: true });
      } catch (err) {
        // If backend rejects address fields (validation), retry without address and PATCH profile
        const status = err?.status;
        const resp = err?.response;
        const messageText = (resp && (resp.message || JSON.stringify(resp))) || err?.message || '';

        const looksLikeAddressRejection = /address|city|state|country|postalCode|latitude|longitude|should not exist/i.test(messageText);

        if (status === 400 && looksLikeAddressRejection) {
          console.warn('[useOnboardVendor] Backend rejected address in create payload, retrying without address');
          const payloadNoAddress = { ...createPayload };
          delete payloadNoAddress.address;
          delete payloadNoAddress.city;
          delete payloadNoAddress.state;
          delete payloadNoAddress.country;
          delete payloadNoAddress.postalCode;
          delete payloadNoAddress.latitude;
          delete payloadNoAddress.longitude;

          try {
            created = await api.post('/api/business/onboard', payloadNoAddress, { auth: true });

            // If creation succeeded, persist profile via PATCH
            const profilePayload = {
              address: formData.address || '',
              city: formData.city || '',
              state: formData.state || '',
              country: formData.country || '',
              postalCode: formData.postalCode || '',
              latitude: typeof formData.latitude !== 'undefined' ? formData.latitude : null,
              longitude: typeof formData.longitude !== 'undefined' ? formData.longitude : null,
            };

            const businessIdRetry = created.id || created._id;
            try {
              const patchRes = await api.patch(`/api/business/${businessIdRetry}`, profilePayload, { auth: true });
              // merge patched profile into created object for context
              // If patchRes has data property, use it, otherwise use patchRes directly
              const patchedData = patchRes?.data || patchRes;
              // Update the data property of created if it exists, otherwise just merge
              if (created.data) {
                 created.data = { ...created.data, ...patchedData };
              } else {
                 created = { ...created, ...patchedData };
              }
            } catch (patchErr) {
              console.warn('[useOnboardVendor] profile PATCH after retry failed:', patchErr);
            }
          } catch (retryErr) {
            console.error('[useOnboardVendor] Retry create without address failed:', retryErr);
            throw retryErr;
          }
        } else {
          throw err;
        }
      }

      // Unwrap response if wrapped in 'data'
      const businessData = created?.data || created;

      if (!businessData || !(businessData.id || businessData._id)) {
        const msg = 'Failed to create business. Check server response.';
        console.error('[useOnboardVendor] create failed:', created);
        // Removed undefined toast call
        addToast({ message: msg, type: 'error' });
        setError(msg);
        setLoading(false);
        return null;
      }

      const businessId = businessData.id || businessData._id;

      // If BusinessContext is available, update it so other pages see the new business immediately
      try {
        const ctx = businessCtx;
        if (ctx && typeof ctx.setBusiness === 'function') {
          // normalize created object to the context shape
          const normalized = {
            id: businessId,
            businessName: businessData.businessName || businessData.name || '',
            businessLocation: businessData.businessLocation || businessData.location || '',
            businessDescription: businessData.businessDescription || businessData.description || '',
            phoneNumber: businessData.phoneNumber || businessData.phone || '',
            businessEmail: businessData.businessEmail || businessData.email || '',
            website: businessData.website || '',
            profileImage: businessData.profileImage || null,
          };
          ctx.setBusiness(normalized);
        }
      } catch (err) {
        console.warn('[useOnboardVendor] could not set BusinessContext (not present):', err?.message || err);
      }

      // Since address/location are included in the create payload above, merge
      // the original created response with any address fields the user supplied
      // so the `BusinessContext` reflects the full profile immediately.
      try {
        const ctx = businessCtx;
        if (ctx && typeof ctx.setBusiness === 'function') {
          const merged = {
            ...businessData,
            address: formData.address || businessData.address || '',
            city: formData.city || businessData.city || '',
            state: formData.state || businessData.state || '',
            country: formData.country || businessData.country || '',
            postalCode: formData.postalCode || businessData.postalCode || '',
            latitude: typeof formData.latitude !== 'undefined' ? formData.latitude : businessData.latitude,
            longitude: typeof formData.longitude !== 'undefined' ? formData.longitude : businessData.longitude,
          };
          ctx.setBusiness(merged);
        }
      } catch (err) {
        console.warn('[useOnboardVendor] could not merge profile into BusinessContext:', err?.message || err);
      }

      addToast({ message: 'Business created and profile saved.', type: 'success' });
      router.replace('/dashboard/business/home');
      return created;
    } catch (err) {
      handleApiError(err, { addToast }, { setLoading, setError });
      return null;
    }
  };

  return { submitOnboarding, loading, error };
}
