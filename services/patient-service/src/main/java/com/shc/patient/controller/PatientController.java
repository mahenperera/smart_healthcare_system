package com.shc.patient.controller;

import java.util.UUID;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import com.shc.patient.service.PatientService;
import com.shc.patient.dto.PatientRequestDTO;
import com.shc.patient.model.Patient;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/patients")
    public void createPatient(@RequestBody PatientRequestDTO patientRequestDTO) {
        patientService.createPatient(patientRequestDTO);
    }

    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/patients/{id}")
    public PatientRequestDTO getPatientById(@PathVariable UUID id) {
        return patientService.getPatientById(id);
    }

    @GetMapping("/patients/nic/{nic}")
    public PatientRequestDTO getPatientByNic(@PathVariable String nic) {
        return patientService.getPatientByNic(nic);
    }

    @GetMapping("/patients/user/{userId}")
    public Patient getPatientByUserId(@PathVariable String userId) {
        return patientService.getPatientByUserId(userId);
    }

    @PutMapping("/patients/{id}")   
    public PatientRequestDTO updatePatient(@PathVariable UUID id, @RequestBody PatientRequestDTO patientRequestDTO) {
        return patientService.updatePatient(id, patientRequestDTO);
    }

    @DeleteMapping("/patients/{id}")
    public void deletePatient(@PathVariable UUID id) {
        patientService.deletePatient(id);
    }

    @PostMapping("/patients/{id}/upload-image")
    public ResponseEntity<?> uploadImage(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        String imageUrl = patientService.updateProfileImage(id, file);
        return ResponseEntity.ok().body(java.util.Map.of("profileImageUrl", imageUrl));
    }

}
