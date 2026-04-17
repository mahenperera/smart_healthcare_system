package com.shc.patient.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table
public class Prescription {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "patient_id", columnDefinition = "UUID")
    private UUID patientId;

    private UUID doctorId;
    private String medicationName;
    private String dosage;
    private String instructions;
    private LocalDateTime prescribedAt;

    public Prescription() {}

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

    @PrePersist
    public void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.prescribedAt == null) {
            this.prescribedAt = LocalDateTime.now();
        }
    }
}
