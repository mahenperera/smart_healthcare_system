package com.shc.doctor.controller;

import com.shc.doctor.dto.PrescriptionDTO;
import com.shc.doctor.dto.PrescriptionResponseDTO;
import com.shc.doctor.service.PrescriptionService;
import com.shc.doctor.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService service;
    private final AuthUtil authUtil;

    public PrescriptionController(PrescriptionService service, AuthUtil authUtil) {
        this.service = service;
        this.authUtil = authUtil;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionResponseDTO> createPrescription(@Valid @RequestBody PrescriptionDTO dto) {
        // Ensure the doctorId matches the authenticated user
        String currentUserId = authUtil.getCurrentUserId();
        dto.setDoctorId(currentUserId);

        PrescriptionResponseDTO response = service.createPrescription(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionResponseDTO> updatePrescription(
            @PathVariable UUID id,
            @Valid @RequestBody PrescriptionDTO dto) {

        String currentUserId = authUtil.getCurrentUserId();
        dto.setDoctorId(currentUserId);

        PrescriptionResponseDTO response = service.updatePrescription(id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<PrescriptionResponseDTO> getPrescriptionById(@PathVariable UUID id) {
        PrescriptionResponseDTO response = service.getPrescriptionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<List<PrescriptionResponseDTO>> getByPatient(@PathVariable String patientId) {
        List<PrescriptionResponseDTO> prescriptions = service.getByPatient(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<PrescriptionResponseDTO>> getByDoctor(@PathVariable String doctorId) {
        List<PrescriptionResponseDTO> prescriptions = service.getByDoctor(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/my-prescriptions")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PrescriptionResponseDTO>> getMyPrescriptions() {
        String currentUserId = authUtil.getCurrentUserId();
        List<PrescriptionResponseDTO> prescriptions = service.getByDoctor(currentUserId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<List<PrescriptionResponseDTO>> getByAppointment(@PathVariable String appointmentId) {
        List<PrescriptionResponseDTO> prescriptions = service.getByAppointment(appointmentId);
        return ResponseEntity.ok(prescriptions);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deletePrescription(@PathVariable UUID id) {
        service.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionResponseDTO> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> statusUpdate) {

        String status = statusUpdate.get("status");
        PrescriptionResponseDTO response = service.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }
}