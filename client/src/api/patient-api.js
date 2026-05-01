// client/src/api/patient-api.js

// import { http } from "./http";

// export const patientApi = {
//   list: () => http.get("/patients"),
//   getById: (id) => http.get(`/patients/${id}`),
//   getByNic: (nic) => http.get(`/patients/nic/${nic}`),
//   update: (id, payload) => http.put(`/patients/${id}`, payload),
//   remove: (id) => http.delete(`/patients/${id}`),
// };

import { http } from "./http";

export const patientApi = {
  list: () => http.get("/api/patients"),
  getById: (id) => http.get(`/api/patients/${id}`),
  getByNic: (nic) => http.get(`/api/patients/nic/${nic}`),
  getByUserId: (userId) => http.get(`/api/patients/user/${userId}`),
  update: (id, payload) => http.put(`/api/patients/${id}`, payload),
  remove: (id) => http.delete(`/api/patients/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post(`/api/patients/${id}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
