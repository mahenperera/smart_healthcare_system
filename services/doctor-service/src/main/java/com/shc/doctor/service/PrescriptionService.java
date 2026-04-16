package com.shc.doctor.service;

import com.shc.doctor.dto.PrescriptionDTO;
import com.shc.doctor.dto.PrescriptionResponseDTO;

import java.util.List;
import java.util.UUID;

public interface PrescriptionService {

    PrescriptionResponseDTO createPrescription(PrescriptionDTO dto);

    PrescriptionResponseDTO updatePrescription(UUID id, PrescriptionDTO dto);

    PrescriptionResponseDTO getPrescriptionById(UUID id);

    List<PrescriptionResponseDTO> getByPatient(String patientId);

    List<PrescriptionResponseDTO> getByDoctor(String doctorId);

    List<PrescriptionResponseDTO> getByAppointment(String appointmentId);

    void deletePrescription(UUID id);

    PrescriptionResponseDTO updateStatus(UUID id, String status);
}