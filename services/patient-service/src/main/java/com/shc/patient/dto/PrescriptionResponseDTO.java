package com.shc.patient.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class PrescriptionResponseDTO {
    private UUID id;
    private UUID patientId;
    private UUID doctorId;
    private String medicationName;
    private String dosage;
    private String instructions;
    private LocalDateTime prescribedAt;

    public PrescriptionResponseDTO() {}

    public PrescriptionResponseDTO(UUID id, UUID patientId, UUID doctorId, String medicationName, String dosage, String instructions, LocalDateTime prescribedAt) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.instructions = instructions;
        this.prescribedAt = prescribedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }

    public UUID getDoctorId() { return doctorId; }
    public void setDoctorId(UUID doctorId) { this.doctorId = doctorId; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDateTime getPrescribedAt() { return prescribedAt; }
    public void setPrescribedAt(LocalDateTime prescribedAt) { this.prescribedAt = prescribedAt; }
}
