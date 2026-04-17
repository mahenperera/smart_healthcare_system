import { http } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const patientApi = {
  // Existing methods
  list: () => http.get("/api/patients"),
  get: (id) => http.get(`/api/patients/${id}`),
  getByNic: (nic) => http.get(`/api/patients/nic/${nic}`),
  create: (payload) => http.post("/api/patients", payload),
  update: (id, payload) => http.put(`/api/patients/${id}`, payload),
  delete: (id) => http.patch(`/api/patients/${id}/deactivate`, {}),

  // --- RESTORED HUB ENDPOINTS ---

  // Medical History endpoints
  getHistory: (patientId) => http.get(`/api/patients/${patientId}/history`),
  addHistory: (patientId, data) => http.post(`/api/patients/${patientId}/history`, data),

  // Prescription endpoints
  getPrescriptions: (patientId) => http.get(`/api/patients/${patientId}/prescriptions`),
  addPrescription: (patientId, data) => http.post(`/api/patients/${patientId}/prescriptions`, data),

  // Medical Reports endpoints
  getReports: (patientId) => http.get(`/api/patients/${patientId}/reports`),
  
  uploadReport: async (patientId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/api/patients/${patientId}/reports`, {
      method: 'POST',
      body: formData,
      // Note: We don't set Content-Type header so the browser sets it with boundary
    });
    
    if (!response.ok) throw new Error('Failed to upload report');
    return response.json();
  },

  downloadReportUrl: (reportId) => {
    return `${BASE_URL}/api/reports/${reportId}/download`;
  }
};

