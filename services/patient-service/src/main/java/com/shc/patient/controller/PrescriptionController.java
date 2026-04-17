package com.shc.patient.controller;

import com.shc.patient.dto.PrescriptionRequestDTO;
import com.shc.patient.dto.PrescriptionResponseDTO;
import com.shc.patient.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public PrescriptionResponseDTO createPrescription(@PathVariable UUID patientId, @RequestBody PrescriptionRequestDTO requestDTO) {
        return prescriptionService.createPrescription(patientId, requestDTO);
    }

    @GetMapping
    public List<PrescriptionResponseDTO> getPrescriptionsByPatientId(@PathVariable UUID patientId) {
        return prescriptionService.getPrescriptionsByPatientId(patientId);
    }
}
