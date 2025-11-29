// hooks/useOnboardVendor.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';
import { api } from '@/lib/fetchClient';
import { useToast } from '@/components/ui/ToastProvider';
import { useBusiness } from '@/context/BusinessContext';

export function useOnboardVendor() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Try to get BusinessContext if available (may not be present during onboarding pages)
  let businessCtx = null;
  try {
    businessCtx = useBusiness();
  } catch (e) {
    businessCtx = null;
  }

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
        toast?.danger?.(msg);
        setError(msg);
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
              created = { ...(created || {}), ...(patchRes || {}) };
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

      if (!created || !(created.id || created._id)) {
        const msg = 'Failed to create business. Check server response.';
        console.error('[useOnboardVendor] create failed:', created);
        toast?.danger?.(msg);
        setError(msg);
        return null;
      }

      const businessId = created.id || created._id;

      // If BusinessContext is available, update it so other pages see the new business immediately
      try {
        const ctx = businessCtx;
        if (ctx && typeof ctx.setBusiness === 'function') {
          // normalize created object to the context shape
          const normalized = {
            id: businessId,
            businessName: created.businessName || created.name || '',
            businessLocation: created.businessLocation || created.location || '',
            businessDescription: created.businessDescription || created.description || '',
            phoneNumber: created.phoneNumber || created.phone || '',
            businessEmail: created.businessEmail || created.email || '',
            website: created.website || '',
            profileImage: created.profileImage || null,
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
            ...created,
            address: formData.address || created.address || '',
            city: formData.city || created.city || '',
            state: formData.state || created.state || '',
            country: formData.country || created.country || '',
            postalCode: formData.postalCode || created.postalCode || '',
            latitude: typeof formData.latitude !== 'undefined' ? formData.latitude : created.latitude,
            longitude: typeof formData.longitude !== 'undefined' ? formData.longitude : created.longitude,
          };
          ctx.setBusiness(merged);
        }
      } catch (err) {
        console.warn('[useOnboardVendor] could not merge profile into BusinessContext:', err?.message || err);
      }

      toast?.success?.('Business created and profile saved.');
      router.replace('/dashboard/vendor');
      return created;
    } catch (err) {
      console.error('[useOnboardVendor] Error during onboarding:', err);
      const msg = err?.message || 'Onboarding failed. Please try again.';
      toast?.danger?.(msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitOnboarding, loading, error };
}
