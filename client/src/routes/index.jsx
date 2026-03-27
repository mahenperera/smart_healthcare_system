import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/home/HomePage";

import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import AppointmentsListPage from "../pages/appointments/AppointmentsListPage";
import NewAppointmentPage from "../pages/appointments/NewAppointmentPage";
import CreateAppointmentPage from "../pages/appointments/CreateAppointmentPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/appointments" element={<AppointmentsPage />}>
          <Route index element={<AppointmentsListPage />} />
          <Route path="new" element={<NewAppointmentPage />} />
          <Route path="create" element={<CreateAppointmentPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
