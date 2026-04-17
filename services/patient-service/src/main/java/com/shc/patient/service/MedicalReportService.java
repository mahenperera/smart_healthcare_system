package com.shc.patient.service;

import com.shc.patient.dto.MedicalReportResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface MedicalReportService {
    MedicalReportResponseDTO uploadReport(UUID patientId, MultipartFile file);
    List<MedicalReportResponseDTO> getReportsByPatientId(UUID patientId);
    Resource downloadReport(UUID reportId);
}
