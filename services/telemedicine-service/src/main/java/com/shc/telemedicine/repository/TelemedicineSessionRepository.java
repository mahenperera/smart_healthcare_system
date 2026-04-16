package com.shc.telemedicine.repository;

import com.shc.telemedicine.entity.TelemedicineSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TelemedicineSessionRepository extends JpaRepository<TelemedicineSession, UUID> {
    Optional<TelemedicineSession> findByAppointmentId(String appointmentId);
}