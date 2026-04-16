import { useEffect, useState, useRef } from "react";
import { User, Save, Building2, GraduationCap, Briefcase, Award, DollarSign, Image as ImageIcon, Upload, Loader2, MousePointer2 } from "lucide-react";
import { doctorApi } from "../../api/doctor-api";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
 
export default function DoctorProfilePage() {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
 
  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    hospital: "",
    slmcNumber: "",
    experienceYears: 0,
    qualifications: "",
    bio: "",
    consultationFee: 0,
    profileImageUrl: ""
  });
 
  useEffect(() => {
    if (user?.userId && role === "DOCTOR") {
      fetchProfile();
    }
  }, [user, role]);
 
  async function fetchProfile() {
    try {
      setLoading(true);
      const data = await doctorApi.getByUserId(user.userId);
      setProfile(data);
      if (data) {
        setFormData({
          fullName: data.fullName || "",
          specialization: data.specialization || "",
          hospital: data.hospital || "",
          slmcNumber: data.slmcNumber || "",
          experienceYears: data.experienceYears || 0,
          qualifications: data.qualifications || "",
          bio: data.bio || "",
          consultationFee: data.consultationFee || 0,
          profileImageUrl: data.profileImageUrl || ""
        });
      }
    } catch (err) {
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "experienceYears" || name === "consultationFee" ? parseFloat(value) : value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageUpload(file);
    }
  };

  const processImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const response = await doctorApi.uploadImage(profile.id, file);
      const newUrl = response.profileImageUrl || response.data?.profileImageUrl;
      
      setFormData(prev => ({ ...prev, profileImageUrl: newUrl }));
      setSuccess("Profile image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };
 
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
 
    try {
      await doctorApi.update(profile.id, {
        ...formData,
        userId: user.userId
      });
      setSuccess("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }
 
  if (role !== "DOCTOR") {
    return <div className="p-8 text-center text-slate-500">Access Restricted.</div>;
  }
 
  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading profile...</div>;
  }
 
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">My Profile</h1>
          <p className="mt-1 text-slate-600 font-medium">Manage your professional information and public appearance.</p>
        </div>
        <div className="relative group">
          <div 
            className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 transition-all"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {formData.profileImageUrl ? (
              <img src={formData.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-emerald-600" />
            )}
            
            {(uploading || isDragging) && (
              <div className={`absolute inset-0 flex items-center justify-center ${isDragging ? 'bg-emerald-500/40' : 'bg-black/40'}`}>
                {uploading ? (
                  <Loader2 size={24} className="text-white animate-spin" />
                ) : (
                  <Upload size={24} className="text-white animate-bounce" />
                )}
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 h-8 w-8 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Upload size={14} className="text-white" />
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={handleFileSelect} 
            accept="image/*"
            disabled={uploading}
          />
        </div>
      </div>
 
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Basic Info */}
          <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User size={20} className="text-emerald-500" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <Input name="fullName" value={formData.fullName} onChange={handleChange} className="rounded-xl border-slate-200" required />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">SLMC Number</label>
                <Input name="slmcNumber" value={formData.slmcNumber} onChange={handleChange} className="rounded-xl border-slate-200" required />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Profile Photo Status</label>
                <div 
                  className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragging ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-slate-100/50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={`p-2 rounded-full ${isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400'} shadow-sm`}>
                    <Upload size={20} className={isDragging ? "animate-bounce" : ""} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-slate-700">
                      {uploading ? "Uploading..." : "Click or Drag & Drop"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formData.profileImageUrl ? "Replace current photo" : "Upload your profile photo"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
 
          {/* Professional Details */}
          <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award size={20} className="text-emerald-500" /> Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Specialization</label>
                <Input name="specialization" value={formData.specialization} onChange={handleChange} className="rounded-xl border-slate-200" required />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Hospital / Clinic</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input name="hospital" value={formData.hospital} onChange={handleChange} className="pl-10 rounded-xl border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Experience (Years)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="pl-10 rounded-xl border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Consultation Fee</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="pl-10 rounded-xl border-slate-200" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
 
        {/* Bio and Qualifications */}
        <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap size={20} className="text-emerald-500" /> Biography & Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Qualifications</label>
              <Input name="qualifications" value={formData.qualifications} onChange={handleChange} className="rounded-xl border-slate-200" placeholder="MBBS, MD, FRCS..." />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Biography</label>
              <Textarea name="bio" value={formData.bio} onChange={handleChange} className="min-h-[150px] rounded-2xl border-slate-200 resize-none" placeholder="Tell your patients more about yourself..." />
            </div>
          </CardContent>
        </Card>
 
        <div className="flex flex-col items-center gap-4">
          {error && <div className="w-full rounded-2xl bg-red-50 p-4 border border-red-100 text-red-600 text-sm font-bold">{error}</div>}
          {success && <div className="w-full rounded-2xl bg-emerald-50 p-4 border border-emerald-100 text-emerald-700 text-sm font-bold">{success}</div>}
          
          <Button 
            type="submit" 
            disabled={saving} 
            className="w-full max-w-sm h-14 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white font-black text-sm uppercase tracking-widest shadow-lg transition-transform active:scale-[0.98]"
          >
            {saving ? "Saving Changes..." : <span className="flex items-center gap-2"><Save size={18} /> Update Profile</span>}
          </Button>
        </div>
      </form>
    </div>
  );
}
