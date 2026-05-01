import { useState, useEffect, useRef } from "react";
import { Bell, Check, Settings, Info, CalendarClock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notificationApi } from "../../api/notification-api";

const formatDistanceToNow = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getUserNotifications(user.userId);
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read)?.length || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(user.userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'APPOINTMENT': return <CalendarClock size={16} className="text-blue-500" />;
      case 'BILLING': return <CreditCard size={16} className="text-emerald-500" />;
      case 'SYSTEM': return <Info size={16} className="text-amber-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-extrabold text-slate-900">Notifications</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
              )}
              <Link 
                to="/notifications/settings" 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </Link>
            </div>
          </div>

          <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-500">No notifications yet.</p>
                <p className="text-xs font-medium text-slate-400 mt-1">When you get notifications, they'll show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer ${!notification.read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      if (!notification.read) handleMarkAsRead(notification.id);
                    }}
                  >
                    <div className={`mt-0.5 shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${!notification.read ? 'bg-white border-blue-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm truncate ${!notification.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 line-clamp-2 ${!notification.read ? 'font-medium text-slate-600' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="shrink-0 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link 
              to="/notifications/settings" 
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Manage Preferences
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
