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
      toast.addToast(message, 'error');
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
