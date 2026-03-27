import { http } from "./http";

export const appointmentApi = {
  health: () => http.get("/health"),
  list: () => http.get("/api/appointments"),
  get: (id) => http.get(`/api/appointments/${id}`),
  create: (payload) => http.post("/api/appointments", payload),

  // adjust only if your backend paths differ
  cancel: (id) => http.patch(`/api/appointments/${id}/cancel`),
  updateStatus: (id, status) =>
    http.patch(`/api/appointments/${id}/status`, { status }),
};
