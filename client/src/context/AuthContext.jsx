// client/src/context/AuthContext.jsx

import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/auth-api";
import {
  clearAuthSession,
  getStoredUser,
  getToken,
  setAuthSession,
} from "../utils/auth-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  function syncFromStorage() {
    setUser(getStoredUser());
    setToken(getToken());
  }

  async function login(credentials) {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);

      if (!response?.token) {
        throw new Error(response?.message || "Login failed.");
      }

      setAuthSession(response);
      syncFromStorage();
      return response;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const response = await authApi.register(payload);

      if (response?.token) {
        setAuthSession(response);
        syncFromStorage();
      }

      return response;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuthSession();
    setUser(null);
    setToken("");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || "",
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
      syncFromStorage,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
}
