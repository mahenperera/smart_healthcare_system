package com.shc.appointment.repository;

import com.shc.appointment.entity.Appointment;
import com.shc.appointment.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByDoctorIdAndStatus(String doctorId, AppointmentStatus status);

    // For basic clash checking (optional, but useful)
    List<Appointment> findByDoctorIdAndStartTimeLessThanAndEndTimeGreaterThan(
            String doctorId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    List<Appointment> findByPatientIdAndStartTimeLessThanAndEndTimeGreaterThan(
        String patientId,
        LocalDateTime endTime,
        LocalDateTime startTime
);
}