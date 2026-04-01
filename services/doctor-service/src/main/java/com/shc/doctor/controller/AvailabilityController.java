package com.shc.doctor.controller;

import com.shc.doctor.dto.AvailabilityDTO;
import com.shc.doctor.entity.Availability;
import com.shc.doctor.service.AvailabilityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
