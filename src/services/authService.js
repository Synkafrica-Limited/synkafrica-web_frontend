const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || '';
// Normalize so BASE never includes trailing /api to avoid /api/api/... URLs
const BASE = RAW_BASE.replace(/\/api\/?$/, '');
const API_BASE = `${BASE}/api/auth`;

function setTokens({ accessToken, refreshToken }, remember = false) {
  try {
    if (remember) {
      localStorage.setItem("vendorToken", accessToken || "");
      if (refreshToken) localStorage.setItem("vendorRefreshToken", refreshToken);
      localStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.setItem("vendorToken", accessToken || "");
      if (refreshToken) sessionStorage.setItem("vendorRefreshToken", refreshToken);
      sessionStorage.removeItem("rememberMe");
    }
  } catch (err) {
    console.error("Failed to persist tokens:", err);
  }
}

function setUser(user, remember = false) {
  try {
    const raw = JSON.stringify(user || null);
    if (remember) {
      localStorage.setItem("vendorData", raw);
    } else {
      sessionStorage.setItem("vendorData", raw);
    }
  } catch (err) {
    console.error("Failed to persist user data:", err);
  }
}

function getUser() {
  try {
    const raw = localStorage.getItem("vendorData") || sessionStorage.getItem("vendorData");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearTokens() {
  try {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorRefreshToken");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerRefreshToken");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("vendorToken");
    sessionStorage.removeItem("vendorRefreshToken");
    sessionStorage.removeItem("rememberMe");
  } catch (err) {
    console.error("Failed to clear tokens:", err);
  }
}

function getRefreshToken() {
  try {
    // Check for customer refresh token first
    const customerRefreshToken = localStorage.getItem("customerRefreshToken");
    if (customerRefreshToken) return customerRefreshToken;
    
    // Fall back to vendor refresh token
    return localStorage.getItem("vendorRefreshToken") || sessionStorage.getItem("vendorRefreshToken") || null;
  } catch {
    return null;
  }
}

function getAccessToken() {
  try {
    // Check for customer token first (customers use localStorage)
    const customerToken = localStorage.getItem("customerToken");
    if (customerToken) return customerToken;
    
    // Fall back to vendor token
    return localStorage.getItem("vendorToken") || sessionStorage.getItem("vendorToken") || null;
  } catch {
    return null;
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors
  }

  if (!res.ok) {
    // If refresh fails, clear tokens and throw error
    clearTokens();
    const message = (data && data.message) || `Error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  const accessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  if (accessToken) {
    // Update tokens in storage
    const remember = localStorage.getItem("rememberMe") === "true";
    setTokens({ accessToken, refreshToken: newRefreshToken || refreshToken }, remember);
  }

  return data;
}

async function signIn(email, password, remember = false) {
  const res = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors
  }

  if (!res.ok) {
    const message = (data && data.message) || `Error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;

  if (accessToken) setTokens({ accessToken, refreshToken }, remember);

  return data;
}

async function signupVendor(firstName, lastName, email, password, phoneNumber = "") {
  const res = await fetch(`${API_BASE}/vendor/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password, phoneNumber }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;

  // Persist tokens and user by default on signup
  if (accessToken) setTokens({ accessToken, refreshToken }, true);
  if (data?.user) setUser(data.user, true);

  return data;
}

async function signOut() {
  try {
    const token = getAccessToken();
    await fetch(`${API_BASE}/signout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (err) {
    console.error("Sign out request failed:", err);
  } finally {
    clearTokens();
  }
}

async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function resetPassword(email, code, newPassword) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function verifyEmail(code) {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ code }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function changePassword(currentPassword, newPassword) {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function resendOtp(email) {
  const res = await fetch(`${API_BASE}/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function updateProfile(userData) {
  const token = getAccessToken();
  // Toggleable debug: set NEXT_PUBLIC_AUTH_UPDATE_DEBUG=true at build
  // or set localStorage.setItem('AUTH_UPDATE_DEBUG', 'true') in the browser
  const debug = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_AUTH_UPDATE_DEBUG === 'true') ||
    (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('AUTH_UPDATE_DEBUG') === 'true');
  // First try the documented endpoint: PATCH ${BASE}/api/users/profile
  try {
    const usersUrl = `${BASE}/api/users/profile`;
    const usersRes = await fetch(usersUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(userData),
    });

    let usersData = null;
    try { usersData = await usersRes.json(); } catch {}

    if (debug && !usersRes.ok) {
      try { console.debug('[authService.updateProfile] users PATCH failed', { url: usersUrl, method: 'PATCH', status: usersRes.status, body: usersData }); } catch {}
    }

    if (usersRes.ok) {
      // Accept either { user } or direct user object
      const userObj = usersData?.user ? usersData.user : usersData;
      if (userObj) {
        const remember = localStorage.getItem('rememberMe') === 'true';
        setUser(userObj, remember);
      }
      return usersData;
    }

    // If PATCH to users endpoint returned 405/cannot patch, try PUT there before falling back
    const usersMsg = usersData?.message || '';
    if (usersRes.status === 405 || (typeof usersMsg === 'string' && usersMsg.toLowerCase().includes('cannot patch'))) {
      const usersPutRes = await fetch(`${BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      let usersPutData = null;
      try { usersPutData = await usersPutRes.json(); } catch {}
      if (debug && !usersPutRes.ok) {
        try { console.debug('[authService.updateProfile] users PUT failed', { url: `${BASE}/api/users/profile`, method: 'PUT', status: usersPutRes.status, body: usersPutData }); } catch {}
      }

      if (usersPutRes.ok) {
        const userObj = usersPutData?.user ? usersPutData.user : usersPutData;
        if (userObj) {
          const remember = localStorage.getItem('rememberMe') === 'true';
          setUser(userObj, remember);
        }
        return usersPutData;
      }
    }

    // If users endpoint didn't succeed, fallthrough to legacy/alternate logic below
  } catch (e) {
    if (debug) console.debug('[authService.updateProfile] users endpoint attempt threw', e);
    // continue to other fallbacks
  }

  // Primary legacy attempt: /api/auth/profile
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(userData),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (debug && !res.ok) {
    try {
      console.debug('[authService.updateProfile] primary PATCH failed', {
        url: `${API_BASE}/profile`,
        method: 'PATCH',
        status: res.status,
        body: data,
      });
    } catch {
      // swallow logging errors
    }
  }

  // If PATCH is not supported by the backend (some deployments return "Cannot PATCH /path"),
  // try a PUT fallback before throwing.
  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
    // Detect a 'Cannot PATCH' style message or 405 Method Not Allowed and try PUT
    const shouldTryPut = res.status === 405 || (typeof msg === 'string' && msg.toLowerCase().includes('cannot patch'));
    if (shouldTryPut) {
      const putRes = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      let putData = null;
      try {
        putData = await putRes.json();
      } catch {}

      if (debug && !putRes.ok) {
        try {
          console.debug('[authService.updateProfile] primary PUT fallback failed', {
            url: `${API_BASE}/profile`,
            method: 'PUT',
            status: putRes.status,
            body: putData,
          });
        } catch {}
      }

      if (!putRes.ok) {
        const putMsg = putData?.message || `Error ${putRes.status}`;
        const err = new Error(`${msg} — PUT fallback failed: ${putMsg}`);
        err.status = putRes.status;
        throw err;
      }

      // Update stored user data from PUT response
      if (putData?.user) {
        const remember = localStorage.getItem("rememberMe") === "true";
        setUser(putData.user, remember);
      }

      return putData;
    }

    // If we reached here and didn't attempt PUT, or PUT didn't run, try the alternate base endpoint
    // (some deployments expose profile at `${BASE}/api/profile` instead of `${BASE}/api/auth/profile`).
    try {
      const altUrl = `${BASE}/api/profile`;
      const altRes = await fetch(altUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      let altData = null;
      try {
        altData = await altRes.json();
      } catch {}

      if (debug && !altRes.ok) {
        try {
          console.debug('[authService.updateProfile] alternate PATCH failed', {
            url: altUrl,
            method: 'PATCH',
            status: altRes.status,
            body: altData,
          });
        } catch {}
      }

      if (altRes.ok) {
        if (altData?.user) {
          const remember = localStorage.getItem("rememberMe") === "true";
          setUser(altData.user, remember);
        }
        return altData;
      }

      // If PATCH to alt also fails and it's a 405 or similar, try PUT to alt
      if (altRes.status === 405 || (altData && typeof altData.message === 'string' && altData.message.toLowerCase().includes('cannot patch'))) {
        const altPutRes = await fetch(altUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(userData),
        });

        let altPutData = null;
        try {
          altPutData = await altPutRes.json();
        } catch {}

        if (debug && !altPutRes.ok) {
          try {
            console.debug('[authService.updateProfile] alternate PUT failed', {
              url: altUrl,
              method: 'PUT',
              status: altPutRes.status,
              body: altPutData,
            });
          } catch {}
        }

        if (altPutRes.ok) {
          if (altPutData?.user) {
            const remember = localStorage.getItem("rememberMe") === "true";
            setUser(altPutData.user, remember);
          }
          return altPutData;
        }

        const err = new Error(`${msg} — Alternate PUT failed: ${altPutData?.message || `Error ${altPutRes.status}`}`);
        err.status = altPutRes.status;
        throw err;
      }
    } catch (altErr) {
      // If alternate endpoint attempt threw, attach original message for context and rethrow
      const err = new Error(`${msg} — Alternate endpoint attempt failed: ${altErr?.message || ''}`);
      err.status = res.status;
      throw err;
    }

    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  // Update stored user data
  if (data?.user) {
    const remember = localStorage.getItem("rememberMe") === "true";
    setUser(data.user, remember);
  }

  return data;
}

const authService = {
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendOtp,
  updateProfile,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  clearTokens,
  setTokens,
  signupVendor,
  setUser,
  getUser,
};

export default authService;
