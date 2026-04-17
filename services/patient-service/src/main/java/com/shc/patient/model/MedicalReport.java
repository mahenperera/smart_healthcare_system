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
public class MedicalReport {

    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(name = "patient_id", columnDefinition = "UUID")
    private UUID patientId;

    private String fileName;
    private String fileType;
    private String filePath;
    private LocalDateTime uploadedAt;

    public MedicalReport() {
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    @PrePersist
    public void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        uploadedAt = LocalDateTime.now();
    }
}
