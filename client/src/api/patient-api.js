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
  list: () => http.get("/patients"),
  getById: (id) => http.get(`/patients/${id}`),
  getByNic: (nic) => http.get(`/patients/nic/${nic}`),
  update: (id, payload) => http.put(`/patients/${id}`, payload),
  remove: (id) => http.delete(`/patients/${id}`),
};
