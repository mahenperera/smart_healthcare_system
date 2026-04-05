package com.shc.doctor.service;

import com.shc.doctor.dto.DoctorRequestDTO;
import com.shc.doctor.entity.Doctor;

import java.util.List;
import java.util.UUID;

public interface DoctorService {

    Doctor createDoctor(DoctorRequestDTO dto);

    List<Doctor> getAllDoctors();

    Doctor getDoctorByUserId(String userId);

    Doctor updateDoctor(UUID id, DoctorRequestDTO dto);

    void deleteDoctor(UUID id);
}
