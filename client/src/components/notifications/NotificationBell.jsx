import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, Info, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { notificationApi } from "../../api/notification-api";
import { cn } from "../../utils/cn";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const DUMMY_EMAIL = "alex.j@example.com";

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getNotificationsByRecipient(DUMMY_EMAIL);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "SENT": return <CheckCircle className="text-emerald-500" size={16} />;
      case "FAILED": return <AlertCircle className="text-rose-500" size={16} />;
      default: return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full transition-all duration-200 relative",
          isOpen 
            ? "bg-emerald-100 text-emerald-700 shadow-inner" 
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        )}
      >
        <Bell size={20} strokeWidth={2.5} />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg">
              {notifications.length} Total
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center gap-3">
                <div className="h-6 w-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 font-medium">Fetching history...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                        <Mail size={16} className="text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-slate-800 truncate">{notif.subject}</p>
                          {getStatusIcon(notif.status)}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Clock size={10} />
                          {new Date(notif.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 grid place-items-center mb-3">
                  <Bell size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                <p className="text-xs text-slate-400">History will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
