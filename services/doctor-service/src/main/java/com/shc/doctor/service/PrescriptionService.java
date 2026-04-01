package com.shc.doctor.service;

import com.shc.doctor.dto.PrescriptionDTO;
import com.shc.doctor.entity.Prescription;

import java.util.List;

public interface PrescriptionService {

    Prescription createPrescription(PrescriptionDTO dto);

    List<Prescription> getByPatient(String patientId);
}