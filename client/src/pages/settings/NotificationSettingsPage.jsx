import { useState, useEffect } from "react";
import { Bell, CalendarClock, Info, Save, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { notificationApi } from "../../api/notification-api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    appointmentAlertsEnabled: true,
    systemAlertsEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.userId) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getSettings(user.userId);
      if (data) {
        setSettings({
          appointmentAlertsEnabled: data.appointmentAlertsEnabled,
          systemAlertsEnabled: data.systemAlertsEnabled
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load notification settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await notificationApi.updateSettings(user.userId, settings);
      setSuccess("Preferences saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <Bell className="text-emerald-500 h-8 w-8" />
          Notification Preferences
        </h1>
        <p className="mt-2 text-slate-500 font-medium">
          Control how and when you want to be notified by the Smart Healthcare System.
        </p>
      </div>

      <Card className="rounded-[2rem] border border-slate-200 shadow-xl bg-white overflow-hidden">
        <CardHeader className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-xl font-extrabold text-slate-900">
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          
          {/* Appointment Alerts */}
          <div className="p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <CalendarClock size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Appointment Alerts</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Receive notifications when appointments are booked, confirmed, canceled, or rejected.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('appointmentAlertsEnabled')}
              className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${settings.appointmentAlertsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.appointmentAlertsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* System Alerts */}
          <div className="p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1 h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                <Info size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">System Alerts</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Receive important system updates, security alerts, and platform announcements.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('systemAlertsEnabled')}
              className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${settings.systemAlertsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.systemAlertsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col items-end gap-4">
        {error && <div className="w-full rounded-xl bg-red-50 p-4 border border-red-100 text-red-600 text-sm font-bold">{error}</div>}
        {success && <div className="w-full rounded-xl bg-emerald-50 p-4 border border-emerald-100 text-emerald-700 text-sm font-bold">{success}</div>}
        
        <Button 
          onClick={handleSave}
          disabled={saving} 
          className="w-full md:w-auto min-w-[200px] h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          {saving ? "Saving..." : <span className="flex items-center justify-center gap-2"><Save size={18} /> Save Preferences</span>}
        </Button>
      </div>
    </div>
  );
}
