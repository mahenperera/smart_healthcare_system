import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 bg-emerald-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="grid gap-3">
          <div className="text-lg font-extrabold">Smart Healthcare System</div>
          <div className="text-white/80 text-sm">
            Calm, patient-friendly appointment booking inspired by Sri Lankan
            eChannelling-style UX.
          </div>

          <div className="mt-3 grid gap-2 text-sm text-white/85">
            <div className="flex items-center gap-2">
              <Phone size={16} /> +94 xx xxx xxxx
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} /> support@shc.lk
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} /> Colombo, Sri Lanka
            </div>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="font-bold">Other</div>
          <a className="text-white/80 hover:text-white" href="#">
            Terms & Conditions
          </a>
          <a className="text-white/80 hover:text-white" href="#">
            FAQ
          </a>
          <a className="text-white/80 hover:text-white" href="#">
            Privacy Policy
          </a>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="font-bold">About</div>
          <a className="text-white/80 hover:text-white" href="#">
            The Project
          </a>
          <a className="text-white/80 hover:text-white" href="#">
            Team
          </a>
          <a className="text-white/80 hover:text-white" href="#">
            Contact
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/70">
          © 2026 Smart Healthcare System
        </div>
      </div>
    </footer>
  );
}
