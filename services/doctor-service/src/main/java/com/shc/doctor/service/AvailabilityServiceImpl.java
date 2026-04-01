package com.shc.doctor.service;

import com.shc.doctor.dto.AvailabilityDTO;
import com.shc.doctor.entity.Availability;
import com.shc.doctor.entity.Doctor;
import com.shc.doctor.enums.AvailabilityStatus;
import com.shc.doctor.repository.AvailabilityRepository;
import com.shc.doctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilityRepository availabilityRepo;
    private final DoctorRepository doctorRepo;

    public AvailabilityServiceImpl(AvailabilityRepository availabilityRepo,
                                   DoctorRepository doctorRepo) {
        this.availabilityRepo = availabilityRepo;
        this.doctorRepo = doctorRepo;
    }

    @Override
    public Availability createSlot(AvailabilityDTO dto) {

        Doctor doctor = doctorRepo.findByUserId(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new RuntimeException("Start time cannot be after end time");
        }

        Availability slot = new Availability();
        slot.setDoctorId(dto.getDoctorId());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());
        slot.setStatus(AvailabilityStatus.AVAILABLE);

        return availabilityRepo.save(slot);
    }

    @Override
    public List<Availability> getDoctorSlots(String doctorId) {

        doctorRepo.findByUserId(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return availabilityRepo.findByDoctorId(doctorId);
    }
}
