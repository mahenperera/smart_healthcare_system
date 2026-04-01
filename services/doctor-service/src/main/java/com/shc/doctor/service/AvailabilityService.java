package com.shc.doctor.service;

import com.shc.doctor.dto.AvailabilityDTO;
import com.shc.doctor.entity.Availability;

import java.util.List;

public interface AvailabilityService {

    Availability createSlot(AvailabilityDTO dto);

    List<Availability> getDoctorSlots(String doctorId);
}
