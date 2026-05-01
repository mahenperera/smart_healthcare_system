import { http } from "./http";

export const paymentApi = {
  createIntent: (payload) => http.post("/api/payments/create-intent", payload),
  confirm: (id) => http.post(`/api/payments/confirm/${id}`),
  getByAppointmentId: (appointmentId) => http.get(`/api/payments/appointment/${appointmentId}`),
  getByPatientId: (patientId) => http.get(`/api/payments/patient/${patientId}`),
};
