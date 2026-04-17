package com.shc.patient.service;

import com.shc.patient.dto.PrescriptionRequestDTO;
import com.shc.patient.dto.PrescriptionResponseDTO;

import java.util.List;
import java.util.UUID;

public interface PrescriptionService {
    PrescriptionResponseDTO createPrescription(UUID patientId, PrescriptionRequestDTO requestDTO);
    List<PrescriptionResponseDTO> getPrescriptionsByPatientId(UUID patientId);
}
