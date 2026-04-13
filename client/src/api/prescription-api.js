import { http } from "./http";

export const prescriptionApi = {
  create: (payload) => http.post("/api/doctors/prescriptions", payload),
  
  update: (id, payload) => http.put(`/api/doctors/prescriptions/${id}`, payload),
  
  getById: (id) => http.get(`/api/doctors/prescriptions/${id}`),
  
  listForDoctor: (doctorId) => http.get(`/api/doctors/prescriptions/doctor/${doctorId}`),
  
  listForPatient: (patientId) => http.get(`/api/doctors/prescriptions/patient/${patientId}`),
  
  listByAppointment: (appointmentId) => http.get(`/api/doctors/prescriptions/appointment/${appointmentId}`),
  
  delete: (id) => http.delete(`/api/doctors/prescriptions/${id}`),
  
  updateStatus: (id, status) => http.patch(`/api/doctors/prescriptions/${id}/status`, { status }),
  
  getMyPrescriptions: () => http.get("/api/doctors/prescriptions/my-prescriptions"),
};
