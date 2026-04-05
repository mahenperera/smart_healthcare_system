package com.shc.doctor.controller;

import com.shc.doctor.dto.DoctorRequestDTO;
import com.shc.doctor.entity.Doctor;
import com.shc.doctor.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody DoctorRequestDTO dto) {
        return service.createDoctor(dto);
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return service.getAllDoctors();
    }

    @GetMapping("/{userId}")
    public Doctor getDoctorByUserId(@PathVariable String userId) {
        return service.getDoctorByUserId(userId);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable UUID id, @RequestBody DoctorRequestDTO dto) {
        return service.updateDoctor(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable UUID id) {
        service.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}