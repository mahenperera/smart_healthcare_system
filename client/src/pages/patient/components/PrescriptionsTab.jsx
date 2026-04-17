import React, { useState, useEffect } from 'react';
import { patientApi } from '../../../api/patient-api';
import { Pill, Plus, Loader2, ClipboardList, Info, ChevronRight } from 'lucide-react';

// DUMMY DOCTOR ID for MVP
const DUMMY_DOCTOR_ID = '90a886fd-566b-4395-9755-9377f093208c';

export default function PrescriptionsTab({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: DUMMY_DOCTOR_ID,
    medicationName: '',
    dosage: '',
    instructions: '',
    prescribedAt: new Date().toISOString()
  });

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getPrescriptions(patientId);
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await patientApi.addPrescription(patientId, formData);
      setShowForm(false);
      setFormData({ ...formData, medicationName: '', dosage: '', instructions: '' });
      fetchPrescriptions();
    } catch (error) {
      console.error("Error adding prescription:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>Consulting pharmacological database...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Pill className="text-blue-500" size={24} />
          Current Prescriptions
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          Add Prescription
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Medication Name</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                placeholder="e.g. Amoxicillin"
                value={formData.medicationName}
                onChange={e => setFormData({...formData, medicationName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dosage</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                placeholder="e.g. 500mg, twice a day"
                value={formData.dosage}
                onChange={e => setFormData({...formData, dosage: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Instructions</label>
            <textarea 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition min-h-[80px]"
              placeholder="Take after meals for 7 days..."
              value={formData.instructions}
              onChange={e => setFormData({...formData, instructions: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button 
              disabled={submitting}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition shadow-lg flex items-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
              Save Prescription
            </button>
          </div>
        </form>
      )}

      {prescriptions.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ClipboardList size={32} />
          </div>
          <h3 className="font-bold text-slate-700">No prescriptions found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">This patient has no active or past prescriptions listed in the hub profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((p, idx) => (
            <div key={p.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Pill size={24} />
                </div>
                <div className="text-[10px] font-black text-slate-300 group-hover:text-blue-200 transition-colors uppercase tracking-widest">
                  Rx ID: {p.id.split('-')[0]}
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1">{p.medicationName}</h3>
              <p className="text-sm font-bold text-blue-600 mb-4">{p.dosage}</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{p.instructions}"</p>
                </div>
                <div className="flex items-center justify-between pt-1 opacity-60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Prescribed Date</span>
                  <span className="text-[10px] font-bold text-slate-500">{new Date(p.prescribedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors group/btn">
                Refill Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
