package com.shc.patient.service.serviceImpl;

import com.shc.patient.dto.PrescriptionRequestDTO;
import com.shc.patient.dto.PrescriptionResponseDTO;
import com.shc.patient.model.Prescription;
import com.shc.patient.repository.PatientRepository;
import com.shc.patient.repository.PrescriptionRepository;
import com.shc.patient.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public PrescriptionResponseDTO createPrescription(UUID patientId, PrescriptionRequestDTO requestDTO) {
        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found with id " + patientId);
        }

        Prescription prescription = new Prescription();
        prescription.setPatientId(patientId);
        prescription.setDoctorId(requestDTO.getDoctorId());
        prescription.setMedicationName(requestDTO.getMedicationName());
        prescription.setDosage(requestDTO.getDosage());
        prescription.setInstructions(requestDTO.getInstructions());
        prescription.setPrescribedAt(requestDTO.getPrescribedAt());

        Prescription saved = prescriptionRepository.save(prescription);

        return new PrescriptionResponseDTO(
                saved.getId(),
                saved.getPatientId(),
                saved.getDoctorId(),
                saved.getMedicationName(),
                saved.getDosage(),
                saved.getInstructions(),
                saved.getPrescribedAt()
        );
    }

    @Override
    public List<PrescriptionResponseDTO> getPrescriptionsByPatientId(UUID patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(p -> new PrescriptionResponseDTO(
                        p.getId(),
                        p.getPatientId(),
                        p.getDoctorId(),
                        p.getMedicationName(),
                        p.getDosage(),
                        p.getInstructions(),
                        p.getPrescribedAt()
                )).collect(Collectors.toList());
    }
}
