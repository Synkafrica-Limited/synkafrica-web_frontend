/**
 * Universal error parser for backend API responses
 */
export function parseApiError(error) {
  if (!error) return 'An unexpected error occurred';

  // Network/connection errors
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return 'Network connection failed. Please check your internet and try again.';
  }

  // Backend error response
  if (error.response?.data) {
    const data = error.response.data;
    
    // Try multiple possible error message fields
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(e => e.message || e).join(', ');
    }
    if (data.errors && typeof data.errors === 'object') {
      const firstError = Object.values(data.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
  }

  // Status code messages
  if (error.response?.status) {
    const status = error.response.status;
    if (status === 400) return 'Invalid request. Please check your input.';
    if (status === 401) return 'Authentication failed. Please log in again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'Requested resource not found.';
    if (status === 409) return 'Conflict with existing data.';
    if (status === 422) return 'Validation failed. Please check your input.';
    if (status === 429) return 'Too many requests. Please try again later.';
    if (status >= 500) return 'Server error. Please try again later.';
  }

  // Generic error message
  if (error.message) return error.message;

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Extract field-level errors from backend response
 * Returns { fieldErrors: { fieldName: errorMessage }, generalError: string }
 */
export function extractFieldErrors(error) {
  const result = {
    fieldErrors: {},
    generalError: null,
  };

  if (!error?.response?.data) {
    result.generalError = parseApiError(error);
    return result;
  }

  const data = error.response.data;

  // Handle structured validation errors
  if (data.errors && Array.isArray(data.errors)) {
    data.errors.forEach(err => {
      if (err.field && err.message) {
        result.fieldErrors[err.field] = err.message;
      } else if (err.message) {
        result.generalError = err.message;
      }
    });
  } else if (data.errors && typeof data.errors === 'object') {
    // Handle object-based errors
    Object.entries(data.errors).forEach(([field, message]) => {
      result.fieldErrors[field] = Array.isArray(message) ? message[0] : message;
    });
  }

  // If no field errors, set general error
  if (Object.keys(result.fieldErrors).length === 0) {
    result.generalError = parseApiError(error);
  }

  return result;
}

/**
 * Shared API error handler with toast display
 */
export function handleApiError(error, toast, options = {}) {
  const message = parseApiError(error);
  
  // Display toast if provided
  if (toast) {
    if (typeof toast === 'function') {
      toast(message, 'error');
    } else if (toast.danger) {
      toast.danger(message);
    } else if (toast.error) {
      toast.error(message);
    } else if (toast.addToast) {
      // Support both old format (string, type) and new format ({ message, type })
      toast.addToast({ message, type: 'error' });
    }
  }

  // Reset loading states if provided
  if (options.setLoading) options.setLoading(false);
  if (options.setSubmitting) options.setSubmitting(false);
  if (options.setRefreshing) options.setRefreshing(false);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', error);
  }

  return message;
}
