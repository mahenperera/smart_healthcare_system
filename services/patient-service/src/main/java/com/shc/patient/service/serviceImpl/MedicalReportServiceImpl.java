package com.shc.patient.service.serviceImpl;

import com.shc.patient.dto.MedicalReportResponseDTO;
import com.shc.patient.model.MedicalReport;
import com.shc.patient.repository.MedicalReportRepository;
import com.shc.patient.repository.PatientRepository;
import com.shc.patient.service.MedicalReportService;
import com.shc.patient.storage.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicalReportServiceImpl implements MedicalReportService {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public MedicalReportResponseDTO uploadReport(UUID patientId, MultipartFile file) {
        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found with id " + patientId);
        }

        String filePath = fileStorageService.storeFile(file);

        MedicalReport report = new MedicalReport();
        report.setPatientId(patientId);
        report.setFileName(file.getOriginalFilename());
        report.setFileType(file.getContentType());
        report.setFilePath(filePath);

        MedicalReport savedReport = medicalReportRepository.save(report);

        // Notify patient about new medical report
        try {
            String notificationUrl = "http://localhost:8085/api/notifications/send";
            Map<String, String> notificationRequest = new HashMap<>();
            notificationRequest.put("recipient", "alex.j@example.com"); // Dummy email for MVP
            notificationRequest.put("subject", "New Medical Report Uploaded");
            notificationRequest.put("message", "A new medical report '" + savedReport.getFileName() + "' has been successfully uploaded to your profile.");
            
            restTemplate.postForEntity(notificationUrl, notificationRequest, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return new MedicalReportResponseDTO(
                savedReport.getId(),
                savedReport.getPatientId(),
                savedReport.getFileName(),
                savedReport.getFileType(),
                savedReport.getUploadedAt()
        );
    }

    @Override
    public List<MedicalReportResponseDTO> getReportsByPatientId(UUID patientId) {
        return medicalReportRepository.findByPatientId(patientId)
                .stream()
                .map(report -> new MedicalReportResponseDTO(
                        report.getId(),
                        report.getPatientId(),
                        report.getFileName(),
                        report.getFileType(),
                        report.getUploadedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public Resource downloadReport(UUID reportId) {
        MedicalReport report = medicalReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id " + reportId));

        return fileStorageService.loadFileAsResource(report.getFilePath());
    }
}
