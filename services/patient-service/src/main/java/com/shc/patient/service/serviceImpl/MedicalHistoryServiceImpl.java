package com.shc.patient.service.serviceImpl;

import com.shc.patient.dto.MedicalHistoryRequestDTO;
import com.shc.patient.dto.MedicalHistoryResponseDTO;
import com.shc.patient.model.MedicalHistory;
import com.shc.patient.repository.MedicalHistoryRepository;
import com.shc.patient.repository.PatientRepository;
import com.shc.patient.service.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicalHistoryServiceImpl implements MedicalHistoryService {

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private RestTemplate restTemplate;

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

        // Notify patient about new medical history record
        try {
            String notificationUrl = "http://localhost:8085/api/notifications/send";
            Map<String, String> notificationRequest = new HashMap<>();
            notificationRequest.put("recipient", "alex.j@example.com"); // Dummy email for MVP
            notificationRequest.put("subject", "New Medical History Record Added");
            notificationRequest.put("message", "A new medical record for '" + savedHistory.getCondition() + "' has been added to your profile.");
            
            restTemplate.postForEntity(notificationUrl, notificationRequest, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }

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
