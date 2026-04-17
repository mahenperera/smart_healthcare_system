package com.shc.patient.repository;

import com.shc.patient.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, UUID> {
    List<MedicalReport> findByPatientId(UUID patientId);
}
