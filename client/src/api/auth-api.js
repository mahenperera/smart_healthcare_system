// client/src/api/auth-api.js

import { http } from "./http";

export const authApi = {
  register: (payload) => http.post("/api/auth/register", payload),
  login: (payload) => http.post("/api/auth/login", payload),

  verifyDoctor: (payload) => http.post("/api/auth/verify-doctor", payload),
  getPendingDoctors: () => http.get("/api/auth/pending-doctors"),
  getUserById: (userId) => http.get(`/api/auth/user/${userId}`),
  getUserByEmail: (email) =>
    http.get(`/api/auth/user/email/${encodeURIComponent(email)}`),
};
