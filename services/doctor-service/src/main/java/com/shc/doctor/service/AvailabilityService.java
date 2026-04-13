package com.shc.doctor.service;
 
import com.shc.doctor.dto.AvailabilityDTO;
import com.shc.doctor.entity.Availability;
 
import java.util.List;
import java.util.UUID;
 
public interface AvailabilityService {
 
    Availability createSlot(AvailabilityDTO dto);
 
    List<Availability> getDoctorSlots(String doctorId);
 
    Availability updateSlot(UUID id, AvailabilityDTO dto);
 
    void deleteSlot(UUID id);
}
