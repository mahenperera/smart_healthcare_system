package com.shc.doctor.dto;
 
import com.shc.doctor.enums.AvailabilityStatus;
import java.time.LocalDateTime;
 
public class AvailabilityDTO {
 
    private String doctorId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AvailabilityStatus status;
 
    public String getDoctorId() {
        return doctorId;
    }
 
    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }
 
    public LocalDateTime getStartTime() {
        return startTime;
    }
 
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
 
    public LocalDateTime getEndTime() {
        return endTime;
    }
 
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
 
    public AvailabilityStatus getStatus() {
        return status;
    }
 
    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }
}