import authService from '@/services/authService';

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || '';
// Normalize so BASE never includes trailing /api to avoid /api/api/... URLs
const BASE = RAW_BASE.replace(/\/api\/?$/, '');

function buildUrl(path) {
  if (!path) return BASE;
  // allow absolute URLs
  if (path.startsWith('http')) return path;
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function request(method, path, body = null, opts = {}) {
  const headers = opts.headers ? { ...opts.headers } : {};
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (opts.auth) {
    const token = authService.getAccessToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = buildUrl(path);
  console.log(`API ${method} ${fullUrl}`, { body, headers: { ...headers, Authorization: headers.Authorization ? '[REDACTED]' : undefined } });

  let res = await fetch(fullUrl, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const contentType = res.headers.get('content-type');
  try {
    if (contentType && contentType.includes('application/json')) {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        data = JSON.parse(text);
      }
    }
  } catch {
    // ignore non-json or empty responses
  }

  // If we get a 401 and this request requires auth, try to refresh the token
  if (res.status === 401 && opts.auth && authService.getRefreshToken?.()) {
    try {
      console.log('Token expired, attempting refresh...');
      await authService.refreshAccessToken();
      
      // Retry the request with the new token
      const newToken = authService.getAccessToken?.();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        
        console.log(`API ${method} ${fullUrl} (retry)`, { body, headers: { ...headers, Authorization: '[REDACTED]' } });
        
        res = await fetch(fullUrl, {
          method,
          headers,
          body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
        });
        
        // Re-parse the response
        data = null;
        const contentType = res.headers.get('content-type');
        try {
          if (contentType && contentType.includes('application/json')) {
            const text = await res.text();
            if (text && text.trim().length > 0) {
              data = JSON.parse(text);
            }
          }
        } catch {
          // ignore non-json or empty responses
        }
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // If refresh fails, clear tokens and redirect to login
      authService.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/business/login?expired=true';
      }
      throw new Error('Authentication expired. Please log in again.');
    }
  }

  if (!res.ok) {
    const errorMessage = (data && data.message) || `HTTP ${res.status}: ${res.statusText}`;
    const err = new Error(errorMessage);
    err.status = res.status;
    err.response = data;
    err.url = fullUrl;
    err.method = method;

  // Only log errors in development or for non-auth errors
  // Skip logging for expected 404s on verification endpoints (we use fallback)
  const isVerificationEndpoint = fullUrl.includes('/verification');
  const shouldSkipLog = (res.status === 404 && isVerificationEndpoint);
  
  if (!shouldSkipLog && (process.env.NODE_ENV === 'development' || (res.status !== 401 && res.status !== 404))) {
    let headersObj = {};
    try {
      if (res && res.headers) {
        if (typeof res.headers.entries === 'function') {
          headersObj = Object.fromEntries(res.headers.entries());
        } else if (typeof res.headers.forEach === 'function') {
          // Some environments expose headers with forEach
          const tmp = {};
          res.headers.forEach((value, key) => {
            tmp[key] = value;
          });
          headersObj = tmp;
        }
      }
    } catch (hdrErr) {
      headersObj = { error: 'failed to read headers', message: String(hdrErr) };
    }

    console.error(`API Error ${method} ${fullUrl}:`, {
      status: res && res.status,
      statusText: res && res.statusText,
      response: data,
      headers: headersObj,
    });
  }

  throw err;
  }

  if (data !== null && data !== undefined) {
    console.log(`API Success ${method} ${fullUrl}:`, data);
  }
  return data;
}

export const api = {
  get: (path, opts) => request('GET', path, null, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  patch: (path, body, opts) => request('PATCH', path, body, opts),
  del: (path, opts) => request('DELETE', path, null, opts),
};

export default api;
