package com.shc.patient.controller;

import com.shc.patient.dto.MedicalHistoryRequestDTO;
import com.shc.patient.dto.MedicalHistoryResponseDTO;
import com.shc.patient.service.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/history")
public class MedicalHistoryController {

    @Autowired
    private MedicalHistoryService medicalHistoryService;

    @PostMapping
    public MedicalHistoryResponseDTO addMedicalHistory(@PathVariable UUID patientId, @RequestBody MedicalHistoryRequestDTO requestDTO) {
        return medicalHistoryService.addMedicalHistory(patientId, requestDTO);
    }

    @GetMapping
    public List<MedicalHistoryResponseDTO> getMedicalHistoryByPatientId(@PathVariable UUID patientId) {
        return medicalHistoryService.getMedicalHistoryByPatientId(patientId);
    }
}
