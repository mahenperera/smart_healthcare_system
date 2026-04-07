import { http } from "./http";

export const doctorApi = {
  list: () => http.get("/api/doctors"),
  getByUserId: (userId) => http.get(`/api/doctors/${userId}`),

  listAvailability: (doctorId) =>
    http.get(`/api/doctors/availability/${doctorId}`),

  createAvailability: (payload) =>
    http.post("/api/doctors/availability", payload),
};
