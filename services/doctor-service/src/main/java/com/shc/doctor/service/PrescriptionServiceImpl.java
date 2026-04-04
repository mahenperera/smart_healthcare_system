package com.shc.doctor.service;

import com.shc.doctor.dto.PrescriptionDTO;
import com.shc.doctor.dto.PrescriptionResponseDTO;
import com.shc.doctor.entity.Doctor;
import com.shc.doctor.entity.Prescription;
import com.shc.doctor.repository.DoctorRepository;
import com.shc.doctor.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepo;
    private final DoctorRepository doctorRepo;
    private final ObjectMapper objectMapper;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepo,
                                   DoctorRepository doctorRepo,
                                   ObjectMapper objectMapper) {
        this.prescriptionRepo = prescriptionRepo;
        this.doctorRepo = doctorRepo;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO createPrescription(PrescriptionDTO dto) {
        Doctor doctor = doctorRepo.findByUserId(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Prescription prescription = new Prescription();
        prescription.setDoctorId(dto.getDoctorId());
        prescription.setPatientId(dto.getPatientId());
        prescription.setAppointmentId(dto.getAppointmentId());
        prescription.setPatientName(dto.getPatientName());
        prescription.setPatientAge(dto.getPatientAge());
        prescription.setPatientGender(dto.getPatientGender());
        prescription.setDiagnosis(dto.getDiagnosis());
        prescription.setSymptoms(dto.getSymptoms());

        // Convert medications list to JSON string
        try {
            prescription.setMedications(objectMapper.writeValueAsString(dto.getMedications()));
        } catch (Exception e) {
            throw new RuntimeException("Error processing medications", e);
        }

        prescription.setLabTests(dto.getLabTests());
        prescription.setInstructions(dto.getInstructions());
        prescription.setFollowUpNotes(dto.getFollowUpNotes());
        prescription.setFollowUpDate(dto.getFollowUpDate());
        prescription.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        Prescription saved = prescriptionRepo.save(prescription);
        return toResponseDTO(saved, doctor.getFullName());
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO updatePrescription(UUID id, PrescriptionDTO dto) {
        Prescription prescription = prescriptionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        Doctor doctor = doctorRepo.findByUserId(prescription.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        prescription.setPatientName(dto.getPatientName());
        prescription.setPatientAge(dto.getPatientAge());
        prescription.setPatientGender(dto.getPatientGender());
        prescription.setDiagnosis(dto.getDiagnosis());
        prescription.setSymptoms(dto.getSymptoms());

        try {
            prescription.setMedications(objectMapper.writeValueAsString(dto.getMedications()));
        } catch (Exception e) {
            throw new RuntimeException("Error processing medications", e);
        }

        prescription.setLabTests(dto.getLabTests());
        prescription.setInstructions(dto.getInstructions());
        prescription.setFollowUpNotes(dto.getFollowUpNotes());
        prescription.setFollowUpDate(dto.getFollowUpDate());
        if (dto.getStatus() != null) {
            prescription.setStatus(dto.getStatus());
        }

        Prescription updated = prescriptionRepo.save(prescription);
        return toResponseDTO(updated, doctor.getFullName());
    }

    @Override
    public PrescriptionResponseDTO getPrescriptionById(UUID id) {
        Prescription prescription = prescriptionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        Doctor doctor = doctorRepo.findByUserId(prescription.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return toResponseDTO(prescription, doctor.getFullName());
    }

    @Override
    public List<PrescriptionResponseDTO> getByPatient(String patientId) {
        return prescriptionRepo.findByPatientId(patientId).stream()
                .map(this::toResponseDTOWithDoctorName)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponseDTO> getByDoctor(String doctorId) {
        return prescriptionRepo.findByDoctorId(doctorId).stream()
                .map(this::toResponseDTOWithDoctorName)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponseDTO> getByAppointment(String appointmentId) {
        return prescriptionRepo.findByAppointmentId(appointmentId).stream()
                .map(this::toResponseDTOWithDoctorName)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePrescription(UUID id) {
        if (!prescriptionRepo.existsById(id)) {
            throw new RuntimeException("Prescription not found");
        }
        prescriptionRepo.deleteById(id);
    }

    @Override
    @Transactional
    public PrescriptionResponseDTO updateStatus(UUID id, String status) {
        Prescription prescription = prescriptionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        prescription.setStatus(status);
        Prescription updated = prescriptionRepo.save(prescription);

        Doctor doctor = doctorRepo.findByUserId(prescription.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return toResponseDTO(updated, doctor.getFullName());
    }

    private PrescriptionResponseDTO toResponseDTOWithDoctorName(Prescription prescription) {
        Doctor doctor = doctorRepo.findByUserId(prescription.getDoctorId())
                .orElse(null);
        String doctorName = doctor != null ? doctor.getFullName() : "Unknown";
        return toResponseDTO(prescription, doctorName);
    }

    private PrescriptionResponseDTO toResponseDTO(Prescription prescription, String doctorName) {
        PrescriptionResponseDTO dto = new PrescriptionResponseDTO();
        dto.setId(prescription.getId());
        dto.setDoctorId(prescription.getDoctorId());
        dto.setDoctorName(doctorName);
        dto.setPatientId(prescription.getPatientId());
        dto.setPatientName(prescription.getPatientName());
        dto.setPatientAge(prescription.getPatientAge());
        dto.setPatientGender(prescription.getPatientGender());
        dto.setAppointmentId(prescription.getAppointmentId());
        dto.setDiagnosis(prescription.getDiagnosis());
        dto.setSymptoms(prescription.getSymptoms());

        // Convert JSON string back to list
        try {
            List<PrescriptionDTO.MedicationItem> medications = objectMapper.readValue(
                    prescription.getMedications(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, PrescriptionDTO.MedicationItem.class)
            );
            dto.setMedications(medications);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing medications", e);
        }

        dto.setLabTests(prescription.getLabTests());
        dto.setInstructions(prescription.getInstructions());
        dto.setFollowUpNotes(prescription.getFollowUpNotes());
        dto.setFollowUpDate(prescription.getFollowUpDate());
        dto.setStatus(prescription.getStatus());
        dto.setCreatedAt(prescription.getCreatedAt());
        dto.setUpdatedAt(prescription.getUpdatedAt());

        return dto;
    }
}