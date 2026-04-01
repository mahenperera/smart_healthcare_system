package com.shc.doctor.service;

import com.shc.doctor.dto.DoctorRequestDTO;
import com.shc.doctor.entity.Doctor;
import com.shc.doctor.exception.ResourceNotFoundException;
import com.shc.doctor.mapper.DoctorMapper;
import com.shc.doctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository repo;

    public DoctorServiceImpl(DoctorRepository repo) {
        this.repo = repo;
    }

    @Override
    public Doctor createDoctor(DoctorRequestDTO dto) {
        return repo.save(DoctorMapper.toEntity(dto));
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return repo.findAll();
    }

    @Override
    public Doctor getDoctorByUserId(String userId) {
        return repo.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    @Override
    public Doctor updateDoctor(UUID id, DoctorRequestDTO dto) {
        Doctor d = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        d.setFullName(dto.getFullName());
        d.setSpecialization(dto.getSpecialization());
        d.setHospital(dto.getHospital());
        d.setQualifications(dto.getQualifications());
        d.setExperienceYears(dto.getExperienceYears());
        d.setBio(dto.getBio());

        return repo.save(d);
    }

    @Override
    public void deleteDoctor(UUID id) {
        Doctor doctor = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        repo.delete(doctor);
    }
}
