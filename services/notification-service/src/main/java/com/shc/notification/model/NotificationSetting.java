package com.shc.notification.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "notification_settings")
public class NotificationSetting {
    
    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    private String userId;
    
    private boolean appointmentAlertsEnabled;
    private boolean systemAlertsEnabled;

    @PrePersist
    public void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public boolean isAppointmentAlertsEnabled() { return appointmentAlertsEnabled; }
    public void setAppointmentAlertsEnabled(boolean appointmentAlertsEnabled) { this.appointmentAlertsEnabled = appointmentAlertsEnabled; }
    
    public boolean isSystemAlertsEnabled() { return systemAlertsEnabled; }
    public void setSystemAlertsEnabled(boolean systemAlertsEnabled) { this.systemAlertsEnabled = systemAlertsEnabled; }
}
