package com.shc.telemedicine.dto;

import com.shc.telemedicine.enums.SessionStatus;

import java.util.UUID;

public class SessionResponse {
    private UUID id;
    private String appointmentId;
    private String channelName;
    private String doctorId;
    private String patientId;
    private SessionStatus status;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getChannelName() { return channelName; }
    public void setChannelName(String channelName) { this.channelName = channelName; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
}