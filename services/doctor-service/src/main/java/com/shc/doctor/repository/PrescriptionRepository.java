package com.shc.doctor.repository;

import com.shc.doctor.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    List<Prescription> findByPatientId(String patientId);

    List<Prescription> findByDoctorId(String doctorId);

    List<Prescription> findByAppointmentId(String appointmentId);

    List<Prescription> findByPatientIdAndStatus(String patientId, String status);

    List<Prescription> findByDoctorIdAndStatus(String doctorId, String status);
}