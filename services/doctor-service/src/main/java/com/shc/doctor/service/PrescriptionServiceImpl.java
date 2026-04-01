package com.shc.doctor.service;

import com.shc.doctor.dto.PrescriptionDTO;
import com.shc.doctor.entity.Doctor;
import com.shc.doctor.entity.Prescription;
import com.shc.doctor.repository.DoctorRepository;
import com.shc.doctor.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepo;
    private final DoctorRepository doctorRepo;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepo,
                                   DoctorRepository doctorRepo) {
        this.prescriptionRepo = prescriptionRepo;
        this.doctorRepo = doctorRepo;
    }

    @Override
    public Prescription createPrescription(PrescriptionDTO dto) {

        Doctor doctor = doctorRepo.findByUserId(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Prescription prescription = new Prescription();
        prescription.setDoctorId(dto.getDoctorId());
        prescription.setPatientId(dto.getPatientId());
        prescription.setAppointmentId(dto.getAppointmentId());
        prescription.setDiagnosis(dto.getDiagnosis());
        prescription.setMedicines(dto.getMedicines());
        prescription.setNotes(dto.getNotes());

        return prescriptionRepo.save(prescription);
    }

    @Override
    public List<Prescription> getByPatient(String patientId) {
        return prescriptionRepo.findByPatientId(patientId);
    }
}