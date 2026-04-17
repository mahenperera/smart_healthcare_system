import { Outlet } from "react-router-dom";

export default function PatientPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Outlet />
    </div>
  );
}
