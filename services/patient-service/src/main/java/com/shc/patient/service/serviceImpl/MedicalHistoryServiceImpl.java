package com.shc.patient.service.serviceImpl;

import com.shc.patient.dto.MedicalHistoryRequestDTO;
import com.shc.patient.dto.MedicalHistoryResponseDTO;
import com.shc.patient.model.MedicalHistory;
import com.shc.patient.repository.MedicalHistoryRepository;
import com.shc.patient.repository.PatientRepository;
import com.shc.patient.service.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicalHistoryServiceImpl implements MedicalHistoryService {

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public MedicalHistoryResponseDTO addMedicalHistory(UUID patientId, MedicalHistoryRequestDTO requestDTO) {
        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found with id " + patientId);
        }

        MedicalHistory history = new MedicalHistory();
        history.setPatientId(patientId);
        history.setCondition(requestDTO.getCondition());
        history.setDiagnosis(requestDTO.getDiagnosis());
        history.setTreatment(requestDTO.getTreatment());
        history.setRecordDate(requestDTO.getRecordDate());

        MedicalHistory savedHistory = medicalHistoryRepository.save(history);

        return new MedicalHistoryResponseDTO(
                savedHistory.getId(),
                savedHistory.getPatientId(),
                savedHistory.getCondition(),
                savedHistory.getDiagnosis(),
                savedHistory.getTreatment(),
                savedHistory.getRecordDate()
        );
    }

    @Override
    public List<MedicalHistoryResponseDTO> getMedicalHistoryByPatientId(UUID patientId) {
        return medicalHistoryRepository.findByPatientId(patientId)
                .stream()
                .map(h -> new MedicalHistoryResponseDTO(
                        h.getId(),
                        h.getPatientId(),
                        h.getCondition(),
                        h.getDiagnosis(),
                        h.getTreatment(),
                        h.getRecordDate()
                )).collect(Collectors.toList());
    }
}
