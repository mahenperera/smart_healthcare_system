import { useEffect, useState, useRef } from "react";
import { User, Save, Upload, Loader2, Mail, Phone, Hash } from "lucide-react";
import { patientApi } from "../../api/patient-api";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function PatientProfilePage() {
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
    name: "",
    nic: "",
    gender: "",
    email: "",
    phone: "",
    profileImageUrl: ""
  });

  useEffect(() => {
    if (user?.userId && role === "PATIENT") {
      fetchProfile();
    }
  }, [user, role]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const data = await patientApi.getByUserId(user.userId);
      setProfile(data);
      if (data) {
        setFormData({
          name: data.name || "",
          nic: data.nic || "",
          gender: data.gender || "",
          email: data.email || "",
          phone: data.phone || "",
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
    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // The profile API currently returns a DTO but we need the patient UUID for image upload.
      // Wait, getByUserId might return the DTO without id, let's check.
      // If we don't have id, we might need it. Let's fetch the full patient using some other endpoint if needed, or assume the API returns the id.
      // For now, assume patient API getByUserId returns the patient ID in `id` or we use `user.userId`. Actually, the PatientController uploadImage takes `UUID id` which is the patient's id, not userId.
      // Oh no, PatientRequestDTO does not have `id`.
      // Let's modify PatientRequestDTO to include `id` so we can upload the image.
      
      const response = await patientApi.uploadImage(profile.id, file);
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
      await patientApi.update(profile.id, {
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

  if (role !== "PATIENT") {
    return <div className="p-8 text-center text-slate-500">Access Restricted.</div>;
  }

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Profile</h1>
          <p className="mt-1 text-slate-500 font-medium">Manage your personal information and contact details.</p>
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
          <Card className="rounded-[2rem] border border-slate-200 shadow-xl bg-white">
            <CardHeader className="p-6 md:p-8 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                <User size={20} className="text-emerald-500" /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6 md:p-8 md:pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} className="h-11 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 transition-all font-semibold text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">NIC Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input name="nic" value={formData.nic} onChange={handleChange} className="h-11 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 transition-all font-semibold text-sm" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="rounded-[2rem] border border-slate-200 shadow-xl bg-white">
            <CardHeader className="p-6 md:p-8 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                <Mail size={20} className="text-emerald-500" /> Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6 md:p-8 md:pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} className="h-11 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 transition-all font-semibold text-sm" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input name="phone" value={formData.phone} onChange={handleChange} className="h-11 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 transition-all font-semibold text-sm" required />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          {error && <div className="w-full rounded-xl bg-red-50 p-4 border border-red-100 text-red-600 text-sm font-bold">{error}</div>}
          {success && <div className="w-full rounded-xl bg-emerald-50 p-4 border border-emerald-100 text-emerald-700 text-sm font-bold">{success}</div>}
          
          <Button 
            type="submit" 
            disabled={saving} 
            className="w-full max-w-sm h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            {saving ? "Saving Changes..." : <span className="flex items-center gap-2"><Save size={18} /> Update Profile</span>}
          </Button>
        </div>
      </form>
    </div>
  );
}
