// import { http } from "./http";

// export const appointmentApi = {
//   health: () => http.get("/health"),
//   list: () => http.get("/api/appointments"),
//   get: (id) => http.get(`/api/appointments/${id}`),
//   create: (payload) => http.post("/api/appointments", payload),

//   // adjust only if your backend paths differ
//   cancel: (id) => http.patch(`/api/appointments/${id}/cancel`),
//   updateStatus: (id, status) =>
//     http.patch(`/api/appointments/${id}/status`, { status }),
// };

// client/src/api/appointment-api.js

import { http } from "./http";

function buildQuery(params = {}) {
  const usp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      usp.set(key, value);
    }
  });

  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export const appointmentApi = {
  health: () => http.get("/health"),

  list: (params = {}) => http.get(`/api/appointments${buildQuery(params)}`),
  get: (id) => http.get(`/api/appointments/${id}`),
  create: (payload) => http.post("/api/appointments", payload),
  update: (id, payload) => http.put(`/api/appointments/${id}`, payload),

  cancel: (id) => http.patch(`/api/appointments/${id}/cancel`),
  updateStatus: (id, status) =>
    http.patch(`/api/appointments/${id}/status`, { status }),
};
