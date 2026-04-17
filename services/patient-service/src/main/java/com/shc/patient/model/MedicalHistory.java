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
public class MedicalHistory {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "patient_id", columnDefinition = "UUID")
    private UUID patientId;

    private String condition;
    private String diagnosis;
    private String treatment;
    private LocalDateTime recordDate;

    public MedicalHistory() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public LocalDateTime getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDateTime recordDate) {
        this.recordDate = recordDate;
    }

    @PrePersist
    public void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.recordDate == null) {
            this.recordDate = LocalDateTime.now();
        }
    }
}
