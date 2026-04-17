package com.shc.patient.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MedicalHistoryResponseDTO {
    private UUID id;
    private UUID patientId;
    private String condition;
    private String diagnosis;
    private String treatment;
    private LocalDateTime recordDate;

    public MedicalHistoryResponseDTO() {}

    public MedicalHistoryResponseDTO(UUID id, UUID patientId, String condition, String diagnosis, String treatment, LocalDateTime recordDate) {
        this.id = id;
        this.patientId = patientId;
        this.condition = condition;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.recordDate = recordDate;
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
}
