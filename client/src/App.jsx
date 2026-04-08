// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/layout/Layout";

// import HomePage from "./pages/home/HomePage";
// import AppointmentsPage from "./pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "./pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "./pages/appointments/NewAppointmentPage";

// function NotFound() {
//   return (
//     <div className="mx-auto max-w-6xl px-4 py-10">
//       <div className="text-2xl font-extrabold">404</div>
//       <div className="text-slate-600">Page not found</div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />

//           <Route path="/appointments" element={<AppointmentsPage />}>
//             <Route index element={<AppointmentsListPage />} />
//             <Route path="new" element={<NewAppointmentPage />} />
//           </Route>

//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// client/src/App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/layout/Layout";

// import HomePage from "./pages/home/HomePage";
// import AppointmentsPage from "./pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "./pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "./pages/appointments/NewAppointmentPage";
// import TelemedicinePage from "./pages/telemedicine/TelemedicinePage";

// function NotFound() {
//   return (
//     <div className="mx-auto max-w-6xl px-4 py-10">
//       <div className="text-2xl font-extrabold">404</div>
//       <div className="text-slate-600">Page not found</div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />

//           <Route path="/appointments" element={<AppointmentsPage />}>
//             <Route index element={<AppointmentsListPage />} />
//             <Route path="new" element={<NewAppointmentPage />} />
//           </Route>

//           <Route
//             path="/telemedicine/:appointmentId"
//             element={<TelemedicinePage />}
//           />

//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// import { Navigate, Route, Routes } from "react-router-dom";
// import Layout from "./components/layout/Layout";
// import HomePage from "./pages/home/HomePage";

// import AppointmentsPage from "./pages/appointments/AppointmentsPage";
// import AppointmentsListPage from "./pages/appointments/AppointmentsListPage";
// import NewAppointmentPage from "./pages/appointments/NewAppointmentPage";
// import CreateAppointmentPage from "./pages/appointments/CreateAppointmentPage";

// import TelemedicinePage from "./pages/telemedicine/TelemedicinePage";

// export default function App() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route path="/" element={<HomePage />} />

//         <Route path="/appointments" element={<AppointmentsPage />}>
//           <Route index element={<AppointmentsListPage />} />
//           <Route path="new" element={<NewAppointmentPage />} />
//           <Route path="create" element={<CreateAppointmentPage />} />
//         </Route>

//         <Route
//           path="/telemedicine/:appointmentId"
//           element={<TelemedicinePage />}
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

// import AppRoutes from "./routes";

// export default function App() {
//   return <AppRoutes />;
// }

// import AppRoutes from "./routes";

// export default function App() {
//   return <AppRoutes />;
// }

import AppRoutes from "./routes";

export default function App() {
  return <AppRoutes />;
}
