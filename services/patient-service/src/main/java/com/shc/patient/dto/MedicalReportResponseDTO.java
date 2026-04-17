package com.shc.patient.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MedicalReportResponseDTO {
    private UUID id;
    private UUID patientId;
    private String fileName;
    private String fileType;
    private LocalDateTime uploadedAt;

    public MedicalReportResponseDTO(UUID id, UUID patientId, String fileName, String fileType, LocalDateTime uploadedAt) {
        this.id = id;
        this.patientId = patientId;
        this.fileName = fileName;
        this.fileType = fileType;
        this.uploadedAt = uploadedAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}
