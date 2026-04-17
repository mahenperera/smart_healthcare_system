package com.shc.patient.controller;

import com.shc.patient.dto.MedicalReportResponseDTO;
import com.shc.patient.service.MedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MedicalReportController {

    @Autowired
    private MedicalReportService medicalReportService;

    @PostMapping(value = "/patients/{patientId}/reports", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MedicalReportResponseDTO uploadReport(@PathVariable UUID patientId, @RequestParam("file") MultipartFile file) {
        return medicalReportService.uploadReport(patientId, file);
    }

    @GetMapping("/patients/{patientId}/reports")
    public List<MedicalReportResponseDTO> getReportsByPatientId(@PathVariable UUID patientId) {
        return medicalReportService.getReportsByPatientId(patientId);
    }

    @GetMapping("/reports/{reportId}/download")
    public ResponseEntity<Resource> downloadReport(@PathVariable UUID reportId) {
        Resource file = medicalReportService.downloadReport(reportId);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
}
