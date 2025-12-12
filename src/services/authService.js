const BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.synkkafrica.com";
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

  if (!res.ok) {
    const msg = data?.message || `Error ${res.status}`;
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
