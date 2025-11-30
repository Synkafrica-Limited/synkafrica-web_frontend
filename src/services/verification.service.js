import { api } from '../lib/fetchClient';
import businessService from './business.service';

class VerificationService {
  // Get verification status for a business
  async getStatus(businessId) {
    try {
      // Try dedicated endpoint first
      try {
        const response = await api.get(`/api/business/${businessId}/verification`, { auth: true });
        return {
          status: response?.status || 'not_started',
          progress: response?.progress || 0,
          submittedAt: response?.submittedAt,
          reviewedAt: response?.reviewedAt,
          rejectionReason: response?.rejectionReason,
          documents: response?.documents || []
        };
      } catch (err) {
        if (err.status === 404) {
          // Fallback: check business profile directly
          const business = await businessService.getBusinessById(businessId);
          
          // Determine status from business profile fields
          let status = 'not_started';
          let progress = 0;
          
          if (business?.verificationStatus) {
            status = business.verificationStatus;
          } else if (business?.isVerified) {
            status = 'verified';
          }

          // Calculate progress based on filled fields
          const requiredFields = ['businessName', 'registrationNumber', 'bankName', 'accountNumber'];
          // Check if certificate exists (could be businessCertificate or certificate)
          const hasCert = business?.certificate || business?.businessCertificate;
          
          let filled = requiredFields.filter(f => business?.[f]).length;
          if (hasCert) filled += 1;
          
          const totalRequired = requiredFields.length + 1;

          if (status === 'not_started' && filled > 0) {
            progress = Math.round((filled / totalRequired) * 100);
          } else if (status === 'verified') {
            progress = 100;
          } else if (status === 'pending') {
            progress = 50;
          }

          return {
            status: status || 'not_started',
            progress: progress,
            submittedAt: business?.updatedAt,
            reviewedAt: null,
            rejectionReason: null,
            documents: hasCert ? [{ url: hasCert }] : []
          };
        }
        throw err;
      }
    } catch (error) {
      console.warn('Verification status check failed:', error);
      return {
        status: 'not_started',
        progress: 0,
        submittedAt: null,
        reviewedAt: null,
        rejectionReason: null,
        documents: []
      };
    }
  }

  // Submit verification documents - backend handles file upload
  async submit(businessId, formData) {
    try {
      // Backend handles Cloudinary upload, so we just send the FormData directly
      let submissionPayload;

      if (formData instanceof FormData) {
        // FormData is already prepared, send as-is
        submissionPayload = formData;
      } else {
        // Convert plain object to FormData
        submissionPayload = new FormData();
        
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
            if (key === 'files' && Array.isArray(formData[key])) {
              // Handle file array
              formData[key].forEach(file => {
                if (file instanceof File) {
                  submissionPayload.append('business_certificate', file);
                }
              });
            } else if (key === 'business_certificate' && formData[key] instanceof File) {
              submissionPayload.append('business_certificate', formData[key]);
            } else if (key !== 'files') {
              submissionPayload.append(key, formData[key]);
            }
          }
        });
      }

      // Try dedicated verification endpoint
      try {
        return await api.post(`/api/business/${businessId}/verification`, submissionPayload, { auth: true });
      } catch (err) {
        if (err.status === 404) {
          console.log('Verification endpoint not found, updating business profile instead...');
          // Fallback: Update Business Profile
          // Backend will handle the file upload via the business update endpoint
          return await api.patch(`/api/business/${businessId}`, submissionPayload, { auth: true });
        }
        throw err;
      }
    } catch (error) {
      console.error('Verification submission failed:', error);
      throw error;
    }
  }

  // Update verification (for resubmission or updates)
  async update(businessId, formData) {
    return this.submit(businessId, formData);
  }

  // Get detailed verification information
  async getDetails(businessId) {
    try {
      return await api.get(`/api/business/${businessId}/verification/details`, { auth: true });
    } catch (e) {
      return null;
    }
  }

  // Cancel pending verification
  async cancel(businessId) {
    try {
      return await api.del(`/api/business/${businessId}/verification`, { auth: true });
    } catch (e) {
      return null;
    }
  }

  // Get verification history
  async getHistory(businessId) {
    try {
      return await api.get(`/api/business/${businessId}/verification/history`, { auth: true });
    } catch (e) {
      return [];
    }
  }

  // Check if business is verified
  async isVerified(businessId) {
    try {
      const status = await this.getStatus(businessId);
      return status.status === 'verified';
    } catch {
      return false;
    }
  }

  // Get verification progress with detailed information
  async getProgress(businessId) {
    const status = await this.getStatus(businessId);
    return status;
  }

  // Validate verification form data
  validateFormData(formData) {
    const errors = {};

    // Required fields validation
    if (!formData.businessType?.trim()) {
      errors.businessType = 'Business type is required';
    }

    if (!formData.companyName?.trim()) {
      errors.companyName = 'Business name is required';
    }

    if (!formData.registrationNumber?.trim()) {
      errors.registrationNumber = 'Registration number is required';
    }

    if (!formData.bankName?.trim()) {
      errors.bankName = 'Bank name is required';
    }

    if (!formData.accountName?.trim()) {
      errors.accountName = 'Account name is required';
    }

    if (!formData.accountNumber?.trim()) {
      errors.accountNumber = 'Account number is required';
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      errors.accountNumber = 'Account number must be 10 digits';
    }

    // File validation
    // If we have existing documents (passed as string/url), skip file check
    const hasExistingCert = typeof formData.business_certificate === 'string' || formData.business_certificate === 'existing';
    
    if (!formData.business_certificate && !hasExistingCert) {
      errors.certificate = 'Registration certificate is required';
    } else if (formData.business_certificate instanceof File) {
      const file = formData.business_certificate;
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

      if (file.size > maxSize) {
        errors.certificate = 'File size must be less than 5MB';
      } else if (!allowedTypes.includes(file.type)) {
        errors.certificate = 'File must be PDF, JPG, or PNG';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Prepare form data for submission
  prepareFormData(formData) {
    const fd = new FormData();

    // Add form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] && key !== 'business_certificate') {
        fd.append(key, formData[key]);
      }
    });

    // Add certificate file
    if (formData.business_certificate instanceof File) {
      fd.append('business_certificate', formData.business_certificate);
    }

    return fd;
  }
}

// Create and export singleton instance
const verificationService = new VerificationService();

export default verificationService;