const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || '';
// Normalize so BASE never includes trailing /api to avoid /api/api/... URLs
const BASE = RAW_BASE.replace(/\/api\/?$/, '');
const API_BASE = `${BASE}/api/auth`;

function _getToken() {
  try {
    return localStorage.getItem("vendorToken") || sessionStorage.getItem("vendorToken") || null;
  } catch {
    return null;
  }
}

async function _tryRequest(url, method, token, body) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    let parsed = null;
    try {
      parsed = await res.json();
    } catch {
      parsed = null;
    }

    return {
      url,
      method,
      ok: res.ok,
      status: res.status,
      body: parsed,
    };
  } catch (err) {
    return {
      url,
      method,
      ok: false,
      status: 0,
      error: err.message,
    };
  }
}

// Probe PATCH/PUT on both API_BASE and alternate BASE/api/profile
export async function probeProfileUpdate(sampleBody = {}) {
  const token = _getToken();
  const attempts = [];

  const urls = [
    `${API_BASE}/profile`,
    `${BASE}/api/profile`,
  ];

  for (const url of urls) {
    // Try PATCH
    attempts.push(await _tryRequest(url, 'PATCH', token, sampleBody));
    // Try PUT
    attempts.push(await _tryRequest(url, 'PUT', token, sampleBody));
  }

  return attempts;
}

export default { probeProfileUpdate };
