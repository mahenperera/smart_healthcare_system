package com.shc.doctor.controller;
 
import com.shc.doctor.dto.AvailabilityDTO;
import com.shc.doctor.entity.Availability;
import com.shc.doctor.service.AvailabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
import java.util.UUID;
 
@RestController
@RequestMapping("/api/doctors/availability")
public class AvailabilityController {
 
    private final AvailabilityService service;
 
    public AvailabilityController(AvailabilityService service) {
        this.service = service;
    }
 
    @PostMapping
    public Availability create(@RequestBody AvailabilityDTO dto) {
        return service.createSlot(dto);
    }
 
    @GetMapping("/{doctorId}")
    public List<Availability> getSlots(@PathVariable String doctorId) {
        return service.getDoctorSlots(doctorId);
    }
 
    @PutMapping("/{id}")
    public Availability update(@PathVariable UUID id, @RequestBody AvailabilityDTO dto) {
        return service.updateSlot(id, dto);
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
