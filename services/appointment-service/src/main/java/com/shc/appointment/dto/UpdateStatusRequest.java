package com.shc.appointment.dto;

import com.shc.appointment.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {
    @NotNull
    private AppointmentStatus status;

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
}