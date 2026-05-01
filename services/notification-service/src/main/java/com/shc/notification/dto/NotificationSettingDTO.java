package com.shc.notification.dto;

public class NotificationSettingDTO {
    private String userId;
    private boolean appointmentAlertsEnabled;
    private boolean systemAlertsEnabled;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public boolean isAppointmentAlertsEnabled() { return appointmentAlertsEnabled; }
    public void setAppointmentAlertsEnabled(boolean appointmentAlertsEnabled) { this.appointmentAlertsEnabled = appointmentAlertsEnabled; }
    
    public boolean isSystemAlertsEnabled() { return systemAlertsEnabled; }
    public void setSystemAlertsEnabled(boolean systemAlertsEnabled) { this.systemAlertsEnabled = systemAlertsEnabled; }
}
