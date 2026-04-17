import React, { useState } from 'react';
import { UserCircle, ActivitySquare, Pill, FileBox } from 'lucide-react';
import MedicalHistoryTab from './components/MedicalHistoryTab';
import PrescriptionsTab from './components/PrescriptionsTab';
import MedicalReportsTab from './components/MedicalReportsTab';

// Hardcoded Dummy UUID for MVP (Restored)
const DUMMY_PATIENT_ID = '0780f2d5-afec-4f27-8025-b003a26d7f02';

export default function PatientHubPage() {
  const [activeTab, setActiveTab] = useState('history');
  
  // Restored patient profile with expanded fields
  const patient = {
    id: DUMMY_PATIENT_ID,
    name: "Alex Johnson",
    nic: "19850412854V",
    gender: "MALE",
    email: "alex.j@example.com",
    phone: "+1 (555) 019-2834",
    dob: "1985-04-12",
    bloodType: "O+",
    createdAt: "2026-01-10T10:30:00Z"
  };

  const tabs = [
    { id: 'history', label: 'Medical History', icon: ActivitySquare },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'reports', label: 'Medical Reports', icon: FileBox },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-emerald-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Profile Card (Glassmorphic) */}
        <div className="bg-white/40 backdrop-blur-3xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col md:flex-row items-center gap-6 animate-in fade-in duration-700">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-full p-1 shadow-lg shadow-brand-500/30">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-brand-600">
                <UserCircle size={48} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{patient.name}</h1>
              <div className="text-xs font-black text-slate-400 mt-2 md:mt-0 bg-white/50 px-3 py-1.5 rounded-full border border-slate-200/50 inline-block uppercase tracking-widest">
                Joined: {new Date(patient.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <span className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-600 border border-white/50 shadow-sm" title="Patient ID">
                <span className="text-slate-400 mr-1 opacity-50 uppercase tracking-tighter">ID:</span><span className="font-mono">{patient.id.split('-')[0]}...</span>
              </span>
              <span className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-600 border border-white/50 shadow-sm">
                <span className="text-slate-400 mr-1 opacity-50 uppercase tracking-tighter">NIC:</span>{patient.nic}
              </span>
              <span className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-600 border border-white/50 shadow-sm">
                <span className="text-slate-400 mr-1 opacity-50 uppercase tracking-tighter">Gender:</span>{patient.gender}
              </span>
              <span className="bg-brand-500 border border-brand-400 text-white font-black px-3 py-1 rounded-full text-[10px] shadow-sm uppercase tracking-widest">
                Blood Group: {patient.bloodType}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                {patient.email}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
                {patient.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2 relative z-10">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-3xl transition-all duration-300 font-bold text-sm ${
                    isActive 
                      ? 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] text-brand-600 scale-100 border border-white' 
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 border border-transparent hover:translate-x-1'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? 'bg-brand-50 text-brand-500' : 'bg-slate-100/50 text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                  {tab.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse ring-4 ring-brand-100"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Space */}
          <div className="lg:col-span-3 min-h-[500px] relative z-10 overflow-hidden rounded-3xl">
            {activeTab === 'history' && <MedicalHistoryTab patientId={patient.id} />}
            {activeTab === 'prescriptions' && <PrescriptionsTab patientId={patient.id} />}
            {activeTab === 'reports' && <MedicalReportsTab patientId={patient.id} />}
          </div>
        </div>

      </div>
    </div>
  );
}
