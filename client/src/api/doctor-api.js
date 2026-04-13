import { http } from "./http";
 
export const doctorApi = {
  list: () => http.get("/api/doctors"),
  getByUserId: (userId) => http.get(`/api/doctors/${userId}`),
 
  update: (id, payload) => http.put(`/api/doctors/${id}`, payload),

  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post(`/api/doctors/${id}/upload-image`, formData);
  },
 
  listAvailability: (doctorId) =>
    http.get(`/api/doctors/availability/${doctorId}`),
 
  createAvailability: (payload) =>
    http.post("/api/doctors/availability", payload),
 
  updateAvailability: (id, payload) =>
    http.put(`/api/doctors/availability/${id}`, payload),
 
  deleteAvailability: (id) =>
    http.delete(`/api/doctors/availability/${id}`),
};
