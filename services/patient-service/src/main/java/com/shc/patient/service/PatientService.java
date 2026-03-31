package com.shc.patient.service;

import java.util.List;

import com.shc.patient.dto.PatientRequestDTO;
import com.shc.patient.model.Patient;

public interface PatientService {

    public void createPatient(PatientRequestDTO patientRequestDTO);

    public List<Patient> getAllPatients();

    public PatientRequestDTO getPatientById(java.util.UUID id);

    public PatientRequestDTO getPatientByNic(String nic);

    public PatientRequestDTO updatePatient(java.util.UUID id, PatientRequestDTO patientRequestDTO);

    public void deletePatient(java.util.UUID id);
    
}
