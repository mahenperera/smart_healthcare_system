package com.shc.patient.service.serviceImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shc.patient.service.PatientService;
import com.shc.patient.dto.PatientRequestDTO;
import com.shc.patient.model.Patient;
import com.shc.patient.repository.PatientRepository;

@Service
public  class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public void createPatient(PatientRequestDTO patientRequestDTO) {
        Patient patient = new Patient();
        patient.setUserId(patientRequestDTO.getUserId());
        patient.setNic(patientRequestDTO.getNic());
        patient.setName(patientRequestDTO.getName());
        patient.setGender(patientRequestDTO.getGender());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setPhone(patientRequestDTO.getPhone());
        patientRepository.save(patient);
    
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public PatientRequestDTO getPatientById(UUID id) {
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        PatientRequestDTO patientRequestDTO = new PatientRequestDTO();
        patientRequestDTO.setUserId(patient.getUserId());
        patientRequestDTO.setNic(patient.getNic());
        patientRequestDTO.setName(patient.getName());
        patientRequestDTO.setGender(patient.getGender());
        patientRequestDTO.setEmail(patient.getEmail());
        patientRequestDTO.setPhone(patient.getPhone());
        return patientRequestDTO;
    }

    @Override
    public PatientRequestDTO getPatientByNic(String nic) {
        Patient patient = patientRepository.findByNic(nic).orElseThrow(() -> new RuntimeException("Patient not found"));
        PatientRequestDTO patientRequestDTO = new PatientRequestDTO();
        patientRequestDTO.setUserId(patient.getUserId());
        patientRequestDTO.setNic(patient.getNic());
        patientRequestDTO.setName(patient.getName());
        patientRequestDTO.setGender(patient.getGender());
        patientRequestDTO.setEmail(patient.getEmail());
        patientRequestDTO.setPhone(patient.getPhone());
        return patientRequestDTO;
    }

    @Override
    public PatientRequestDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO) {
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        if (patientRequestDTO.getUserId() != null) {
            patient.setUserId(patientRequestDTO.getUserId());
        }
        patient.setNic(patientRequestDTO.getNic());
        patient.setName(patientRequestDTO.getName());
        patient.setGender(patientRequestDTO.getGender());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setPhone(patientRequestDTO.getPhone());
        patientRepository.save(patient);
        return patientRequestDTO;
    }

    @Override
    public void deletePatient(UUID id) {
        patientRepository.deleteById(id);
    }

    
    
}
