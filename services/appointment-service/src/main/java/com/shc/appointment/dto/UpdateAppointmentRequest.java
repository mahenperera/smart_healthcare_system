package com.shc.appointment.dto;

import java.time.LocalDateTime;

public class UpdateAppointmentRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String reason;

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}