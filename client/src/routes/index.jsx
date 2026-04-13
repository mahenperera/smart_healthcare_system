// // client/src/routes/index.jsx

// import { Navigate, Route, Routes } from "react-router-dom";
// import Layout from "../components/layout/Layout";
// import HomePage from "../pages/home/HomePage";

// import LoginPage from "../pages/auth/LoginPage";
// import RegisterPage from "../pages/auth/RegisterPage";

// import AppointmentsPage from "../pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "../pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "../pages/appointments/NewAppointmentPage";
// import CreateAppointmentPage from "../pages/appointments/CreateAppointmentPage";

// import TelemedicinePage from "../pages/telemedicine/TelemedicinePage";
// import ProtectedRoute from "./protected-route";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/appointments" element={<AppointmentsPage />}>
//             <Route index element={<AppointmentsListPage />} />
//             <Route path="new" element={<NewAppointmentPage />} />
//             <Route path="create" element={<CreateAppointmentPage />} />
//           </Route>

//           <Route
//             path="/telemedicine/:appointmentId"
//             element={<TelemedicinePage />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

// import { Navigate, Route, Routes } from "react-router-dom";
// import Layout from "../components/layout/Layout";
// import HomePage from "../pages/home/HomePage";

// import LoginPage from "../pages/auth/LoginPage";
// import RegisterPage from "../pages/auth/RegisterPage";

// import AppointmentsPage from "../pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "../pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "../pages/appointments/NewAppointmentPage";
// import CreateAppointmentPage from "../pages/appointments/CreateAppointmentPage";

// import TelemedicinePage from "../pages/telemedicine/TelemedicinePage";
// import ProtectedRoute from "./protected-route";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/appointments" element={<AppointmentsPage />}>
//             <Route index element={<AppointmentsListPage />} />
//             <Route path="new" element={<NewAppointmentPage />} />
//             <Route path="create" element={<CreateAppointmentPage />} />
//           </Route>

//           <Route
//             path="/telemedicine/:appointmentId"
//             element={<TelemedicinePage />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

// import { Navigate, Route, Routes } from "react-router-dom";
// import Layout from "../components/layout/Layout";
// import HomePage from "../pages/home/HomePage";

// import LoginPage from "../pages/auth/LoginPage";
// import RegisterPage from "../pages/auth/RegisterPage";

// import AppointmentsPage from "../pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "../pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "../pages/appointments/NewAppointmentPage";
// import CreateAppointmentPage from "../pages/appointments/CreateAppointmentPage";

// import TelemedicinePage from "../pages/telemedicine/TelemedicinePage";
// import ProtectedRoute from "./protected-route";
// import PublicOnlyRoute from "./public-only-route";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<HomePage />} />

//         <Route element={<PublicOnlyRoute />}>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//         </Route>

//         <Route element={<ProtectedRoute />}>
//           <Route path="/appointments" element={<AppointmentsPage />}>
//             <Route index element={<AppointmentsListPage />} />
//             <Route path="new" element={<NewAppointmentPage />} />
//             <Route path="create" element={<CreateAppointmentPage />} />
//           </Route>

//           <Route
//             path="/telemedicine/:appointmentId"
//             element={<TelemedicinePage />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

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
import DoctorAvailabilityPage from "../pages/doctor/DoctorAvailabilityPage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";
import DoctorPrescriptionListPage from "../pages/doctor/PrescriptionListPage";
import CreatePrescriptionPage from "../pages/doctor/CreatePrescriptionPage";
import AdminDoctorVerificationPage from "../pages/admin/AdminDoctorVerificationPage";
import DoctorDirectoryPage from "../pages/patient/DoctorDirectoryPage";
import DoctorDetailPage from "../pages/patient/DoctorDetailPage";
import PatientPrescriptionsPage from "../pages/patient/PatientPrescriptionsPage";
import ProtectedRoute from "./protected-route";
import PublicOnlyRoute from "./public-only-route";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

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
          <Route
            path="/doctor/availability"
            element={<DoctorAvailabilityPage />}
          />
          <Route
            path="/doctor/profile"
            element={<DoctorProfilePage />}
          />
          <Route
            path="/doctors"
            element={<DoctorDirectoryPage />}
          />
          <Route
            path="/doctors/:userId"
            element={<DoctorDetailPage />}
          />
          <Route
            path="/doctor/prescriptions"
            element={<DoctorPrescriptionListPage />}
          />
          <Route
            path="/doctor/prescriptions/new"
            element={<CreatePrescriptionPage />}
          />
          <Route
            path="/patient/prescriptions"
            element={<PatientPrescriptionsPage />}
          />
          <Route
            path="/admin/verification"
            element={<AdminDoctorVerificationPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
