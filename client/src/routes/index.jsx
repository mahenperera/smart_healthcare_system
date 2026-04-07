// import { Navigate, Route, Routes } from "react-router-dom";
// import Layout from "../components/layout/Layout";
// import HomePage from "../pages/home/HomePage";

// import AppointmentsPage from "../pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "../pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "../pages/appointments/NewAppointmentPage";
// import CreateAppointmentPage from "../pages/appointments/CreateAppointmentPage";

// import TelemedicinePage from "../pages/telemedicine/TelemedicinePage";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<HomePage />} />

//         <Route path="/appointments" element={<AppointmentsPage />}>
//           <Route index element={<AppointmentsListPage />} />
//           <Route path="new" element={<NewAppointmentPage />} />
//           <Route path="create" element={<CreateAppointmentPage />} />
//         </Route>

//         {/* Telemedicine entry (per appointment) */}
//         <Route
//           path="/telemedicine/:appointmentId"
//           element={<TelemedicinePage />}
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

// client/src/routes/index.jsx

import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/home/HomePage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import AppointmentsListPage from "../pages/appointments/AppointmentsListPage";
import NewAppointmentPage from "../pages/appointments/NewAppointmentPage";
import CreateAppointmentPage from "../pages/appointments/CreateAppointmentPage";

import TelemedicinePage from "../pages/telemedicine/TelemedicinePage";
import ProtectedRoute from "./protected-route";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/appointments" element={<AppointmentsPage />}>
            <Route index element={<AppointmentsListPage />} />
            <Route path="new" element={<NewAppointmentPage />} />
            <Route path="create" element={<CreateAppointmentPage />} />
          </Route>

          <Route
            path="/telemedicine/:appointmentId"
            element={<TelemedicinePage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
