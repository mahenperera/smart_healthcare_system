package com.shc.doctor.controller;

import com.shc.doctor.dto.PrescriptionDTO;
import com.shc.doctor.entity.Prescription;
import com.shc.doctor.service.PrescriptionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @PostMapping
    public Prescription create(@RequestBody PrescriptionDTO dto) {
        return service.createPrescription(dto);
    }

    @GetMapping("/patient/{patientId}")
    public List<Prescription> get(@PathVariable String patientId) {
        return service.getByPatient(patientId);
    }
}