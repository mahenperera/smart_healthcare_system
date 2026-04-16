package com.shc.telemedicine.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSessionRequest {
    @NotBlank
    private String appointmentId;

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }
}