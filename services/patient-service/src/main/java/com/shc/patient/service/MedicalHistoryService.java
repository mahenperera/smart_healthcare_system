package com.shc.patient.service;

import com.shc.patient.dto.MedicalHistoryRequestDTO;
import com.shc.patient.dto.MedicalHistoryResponseDTO;

import java.util.List;
import java.util.UUID;

public interface MedicalHistoryService {
    MedicalHistoryResponseDTO addMedicalHistory(UUID patientId, MedicalHistoryRequestDTO requestDTO);
    List<MedicalHistoryResponseDTO> getMedicalHistoryByPatientId(UUID patientId);
}
