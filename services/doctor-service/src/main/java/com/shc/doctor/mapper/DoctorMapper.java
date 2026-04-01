package com.shc.doctor.mapper;

import com.shc.doctor.dto.DoctorRequestDTO;
import com.shc.doctor.entity.Doctor;

public class DoctorMapper {

    public static Doctor toEntity(DoctorRequestDTO dto) {
        Doctor d = new Doctor();
        d.setFullName(dto.getFullName());
        d.setSpecialization(dto.getSpecialization());
        d.setHospital(dto.getHospital());
        d.setSlmcNumber(dto.getSlmcNumber());
        d.setExperienceYears(dto.getExperienceYears());
        d.setQualifications(dto.getQualifications());
        d.setBio(dto.getBio());
        return d;
    }
}