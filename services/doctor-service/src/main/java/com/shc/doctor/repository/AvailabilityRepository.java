package com.shc.doctor.repository;

import com.shc.doctor.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AvailabilityRepository extends JpaRepository<Availability, UUID> {

    List<Availability> findByDoctorId(String doctorId);
}
