import { api } from '../lib/fetchClient';
import { uploadFiles } from '@/lib/cloudinary';

class VerificationService {
  // Get verification status for a business
  async getStatus(businessId) {
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
    } catch (error) {
      // If verification not found or API not available, return default state
      if (error?.status === 404 || error?.status === 500) {
        console.log('Verification API not available, using default state');
        return {
          status: 'not_started',
          progress: 0,
          submittedAt: null,
          reviewedAt: null,
          rejectionReason: null,
          documents: []
        };
      }
      throw error;
    }
  }

  // Submit verification documents
  async submit(businessId, formData) {
    try {
      // If the caller provided a plain object containing `files` (Array<File>) we'll upload them
      if (!(formData instanceof FormData) && formData && Array.isArray(formData.files)) {
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
          throw new Error('Cloudinary not configured. Cannot upload files.');
        }

        // Upload files directly to Cloudinary
        const uploadedUrls = await uploadFiles(formData.files);

        // Prepare payload: send document URLs to backend
        const payload = {
          businessId,
          documents: uploadedUrls.map(u => ({ url: u }))
        };

        // Prefer the documents endpoint if available
        try {
          const resp = await api.post(`/api/business/${businessId}/documents`, payload, { auth: true });
          return resp;
        } catch (err) {
          // fallback to verification endpoint expecting JSON with document URLs
          const resp = await api.post(`/api/business/${businessId}/verification`, payload, { auth: true });
          return resp;
        }
      }

      if (!(formData instanceof FormData)) {
        throw new Error('FormData is required for verification submission');
      }

      const response = await api.post(`/api/business/${businessId}/verification`, formData, { auth: true });
      return response;
    } catch (error) {
      // For development, provide mock success response
      if (process.env.NODE_ENV === 'development' && (error?.status === 404 || error?.status === 500)) {
        console.log('Development mode: Mock verification submission success');
        return {
          success: true,
          message: 'Verification submitted successfully (mock response)',
          status: 'pending'
        };
      }
      throw error;
    }
  }

  // Update verification (for resubmission or updates)
  async update(businessId, formData) {
    if (!(formData instanceof FormData)) {
      throw new Error('FormData is required for verification update');
    }

    const response = await api.put(`/api/business/${businessId}/verification`, formData, { auth: true });
    return response;
  }

  // Get detailed verification information
  async getDetails(businessId) {
    const response = await api.get(`/api/business/${businessId}/verification/details`, { auth: true });
    return response;
  }

  // Cancel pending verification
  async cancel(businessId) {
    const response = await api.del(`/api/business/${businessId}/verification`, { auth: true });
    return response;
  }

  // Get verification history
  async getHistory(businessId) {
    const response = await api.get(`/api/business/${businessId}/verification/history`, { auth: true });
    return response;
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

    // Calculate progress based on status
    const progressMap = {
      'not_started': 0,
      'pending': 50,
      'verified': 100,
      'rejected': 25
    };

    return {
      ...status,
      progress: Math.max(status.progress || 0, progressMap[status.status] || 0)
    };
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
    if (!formData.business_certificate) {
      errors.certificate = 'Registration certificate is required';
    } else {
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
    if (formData.business_certificate) {
      fd.append('business_certificate', formData.business_certificate);
    }

    return fd;
  }
}

// Create and export singleton instance
const verificationService = new VerificationService();

export default verificationService;