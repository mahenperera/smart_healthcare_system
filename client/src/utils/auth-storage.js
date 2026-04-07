// client/src/utils/auth-storage.js

const TOKEN_KEY = "shc_token";
const USER_KEY = "shc_user";

export function setAuthSession(authResponse) {
  const token = authResponse?.token || "";
  const user = authResponse
    ? {
        userId: authResponse.userId || "",
        email: authResponse.email || "",
        role: authResponse.role || "",
        verified: Boolean(authResponse.verified),
        message: authResponse.message || "",
      }
    : null;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
