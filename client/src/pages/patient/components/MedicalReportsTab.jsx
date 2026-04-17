import React, { useState, useEffect } from 'react';
import { patientApi } from '../../../api/patient-api';
import { FileBox, Upload, FileText, Download, Loader2, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function MedicalReportsTab({ patientId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getReports(patientId);
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [patientId]);

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      await patientApi.uploadReport(patientId, file);
      fetchReports();
    } catch (error) {
      alert("Failed to upload report. Please check file size and backend connection.");
    } finally {
      setUploading(false);
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>Scanning secure archives...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <ShieldCheck className="text-emerald-500" size={18} />
              Secure Transmission
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Files are stored locally on the patient-service filesystem. Max file size: 10MB. 
              Supported: PDF, JPG, PNG.
            </p>
          </div>

          <label 
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            className={`
              relative cursor-pointer group block h-64 rounded-3xl border-2 border-dashed transition-all duration-300
              flex flex-col items-center justify-center text-center p-6
              ${dragActive ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50'}
              ${uploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input 
              type="file" 
              className="hidden" 
              onChange={e => handleFile(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className={`
              w-16 h-16 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300
              ${dragActive ? 'bg-brand-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-500'}
            `}>
              {uploading ? <Loader2 className="animate-spin" size={28} /> : <Upload size={28} />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-700">{uploading ? 'Uploading...' : 'Drop files here'}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">or click to browse</p>
            </div>
          </label>
        </div>

        {/* Reports Gallery */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileBox className="text-brand-500" size={24} />
              Stored Records
            </h2>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter shadow-inner">
               {reports.length} Total Documents
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl border border-white/50 border-dashed p-16 text-center">
              <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-sm text-slate-400 font-medium italic">No digitized reports available for this patient.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reports.map((report, idx) => (
                <div key={report.id} className="group bg-white/60 backdrop-blur-md border border-white p-4 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-400 shadow-inner group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-800 truncate" title={report.fileName}>{report.fileName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{report.fileType}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                      Uploaded {new Date(report.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <a 
                        href={patientApi.downloadReportUrl(report.id)}
                        className="p-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                        title="Download Report"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
