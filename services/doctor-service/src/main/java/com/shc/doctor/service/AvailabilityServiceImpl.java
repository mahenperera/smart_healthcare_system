package com.shc.doctor.service;
 
import com.shc.doctor.dto.AvailabilityDTO;
import com.shc.doctor.entity.Availability;
import com.shc.doctor.enums.AvailabilityStatus;
import com.shc.doctor.repository.AvailabilityRepository;
import com.shc.doctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;
 
import java.util.List;
import java.util.UUID;
 
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
 
        doctorRepo.findByUserId(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
 
        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new RuntimeException("Start time cannot be after end time");
        }
 
        Availability slot = new Availability();
        slot.setDoctorId(dto.getDoctorId());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());
        slot.setStatus(dto.getStatus() != null ? dto.getStatus() : AvailabilityStatus.AVAILABLE);
 
        return availabilityRepo.save(slot);
    }
 
    @Override
    public List<Availability> getDoctorSlots(String doctorId) {
 
        doctorRepo.findByUserId(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
 
        return availabilityRepo.findByDoctorId(doctorId);
    }
 
    @Override
    public Availability updateSlot(UUID id, AvailabilityDTO dto) {
        Availability slot = availabilityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
 
        if (dto.getStartTime() != null) slot.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) slot.setEndTime(dto.getEndTime());
        if (dto.getStatus() != null) slot.setStatus(dto.getStatus());
 
        if (slot.getStartTime().isAfter(slot.getEndTime())) {
            throw new RuntimeException("Start time cannot be after end time");
        }
 
        return availabilityRepo.save(slot);
    }
 
    @Override
    public void deleteSlot(UUID id) {
        if (!availabilityRepo.existsById(id)) {
            throw new RuntimeException("Slot not found");
        }
        availabilityRepo.deleteById(id);
    }
}
