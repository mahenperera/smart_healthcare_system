import React, { useState, useEffect } from 'react';
import { patientApi } from '../../../api/patient-api';
import { Plus, History, Loader2, Thermometer } from 'lucide-react';

export default function MedicalHistoryTab({ patientId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    condition: '',
    diagnosis: '',
    treatment: '',
    recordDate: new Date().toISOString().split('T')[0]
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getHistory(patientId);
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await patientApi.addHistory(patientId, formData);
      setShowForm(false);
      setFormData({ condition: '', diagnosis: '', treatment: '', recordDate: new Date().toISOString().split('T')[0] });
      fetchHistory();
    } catch (error) {
      console.error("Error adding history:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>Loading patient history...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <History className="text-brand-500" size={24} />
          Medical History Timeline
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-brand-500/20"
        >
          <Plus size={18} />
          Add Record
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Condition</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                placeholder="e.g. Hypertension"
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                value={formData.recordDate}
                onChange={e => setFormData({...formData, recordDate: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Diagnosis Details</label>
            <textarea 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition min-h-[100px]"
              placeholder="Detailed diagnosis from doctor..."
              value={formData.diagnosis}
              onChange={e => setFormData({...formData, diagnosis: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Treatment Plan</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              placeholder="e.g. Prescribed Lisinopril 10mg"
              value={formData.treatment}
              onChange={e => setFormData({...formData, treatment: e.target.value})}
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
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition shadow-lg flex items-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
              Save Record
            </button>
          </div>
        </form>
      )}

      {history.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Thermometer size={32} />
          </div>
          <h3 className="font-bold text-slate-700">No medical records found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">This patient doesn't have any medical history records in the system yet.</p>
        </div>
      ) : (
        <div className="relative space-y-0 pb-8">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-0 w-0.5 bg-brand-100"></div>

          {history.map((record, index) => (
            <div key={record.id} className="relative pl-12 pb-10 group animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Timeline Dot */}
              <div className="absolute left-0 top-1.5 w-10 h-10 bg-white border-2 border-brand-500 rounded-full flex items-center justify-center z-10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <div className="w-2.5 h-2.5 bg-brand-500 rounded-full ring-4 ring-brand-100"></div>
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-white hover:border-brand-200 p-6 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 group-hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                    {new Date(record.recordDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-800">{record.condition}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Diagnosis</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{record.diagnosis}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Treatment Plan</h4>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl">
                      <p className="text-sm text-emerald-800 font-bold">{record.treatment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
