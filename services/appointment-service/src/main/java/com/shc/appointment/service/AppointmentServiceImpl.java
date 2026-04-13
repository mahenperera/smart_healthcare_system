
package com.shc.appointment.service;

import com.shc.appointment.dto.AppointmentResponse;
import com.shc.appointment.dto.CreateAppointmentRequest;
import com.shc.appointment.dto.UpdateAppointmentRequest;
import com.shc.appointment.entity.Appointment;
import com.shc.appointment.enums.AppointmentStatus;
import com.shc.appointment.exception.BadRequestException;
import com.shc.appointment.exception.ResourceNotFoundException;
import com.shc.appointment.mapper.AppointmentMapper;
import com.shc.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public AppointmentResponse create(CreateAppointmentRequest request) {
        validateTimes(request.getStartTime(), request.getEndTime());

        // doctor should not already have overlapping appointment
        ensureNoDoctorClash(
                request.getDoctorId(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        // patient also should not already have overlapping appointment
        ensureNoPatientClash(
                request.getPatientId(),
                request.getStartTime(),
                request.getEndTime(),
                null
        );

        Appointment appointment = AppointmentMapper.toEntity(request);
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponse getById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));

        return AppointmentMapper.toResponse(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> list(String patientId, String doctorId) {
        List<Appointment> results;

        if (patientId != null && !patientId.isBlank()) {
            results = appointmentRepository.findByPatientId(patientId);
        } else if (doctorId != null && !doctorId.isBlank()) {
            results = appointmentRepository.findByDoctorId(doctorId);
        } else {
            results = appointmentRepository.findAll();
        }

        return results.stream()
                .map(AppointmentMapper::toResponse)
                .toList();
    }

    @Override
    public AppointmentResponse update(UUID id, UpdateAppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED ||
                appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot update a " + appointment.getStatus() + " appointment");
        }

        LocalDateTime newStart = request.getStartTime() != null
                ? request.getStartTime()
                : appointment.getStartTime();

        LocalDateTime newEnd = request.getEndTime() != null
                ? request.getEndTime()
                : appointment.getEndTime();

        validateTimes(newStart, newEnd);

        boolean timeChanged = !(newStart.equals(appointment.getStartTime())
                && newEnd.equals(appointment.getEndTime()));

        if (timeChanged) {
            ensureNoDoctorClash(
                    appointment.getDoctorId(),
                    newStart,
                    newEnd,
                    appointment.getId()
            );

            ensureNoPatientClash(
                    appointment.getPatientId(),
                    newStart,
                    newEnd,
                    appointment.getId()
            );
        }

        AppointmentMapper.applyUpdate(appointment, request);

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toResponse(saved);
    }

    @Override
    public AppointmentResponse cancel(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            return AppointmentMapper.toResponse(appointment);
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a COMPLETED appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toResponse(saved);
    }

    @Override
    public AppointmentResponse updateStatus(UUID id, AppointmentStatus status) {
        if (status == null) {
            throw new BadRequestException("Status is required");
        }

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED ||
                appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot change status of a " + appointment.getStatus() + " appointment");
        }

        appointment.setStatus(status);

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentMapper.toResponse(saved);
    }

    // ----------------- helpers -----------------

    private void validateTimes(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new BadRequestException("startTime and endTime are required");
        }

        if (!start.isBefore(end)) {
            throw new BadRequestException("startTime must be before endTime");
        }
    }

    private void ensureNoDoctorClash(String doctorId, LocalDateTime start, LocalDateTime end, UUID ignoreAppointmentId) {
        if (doctorId == null || doctorId.isBlank()) {
            throw new BadRequestException("doctorId is required");
        }

        List<Appointment> clashes = appointmentRepository
                .findByDoctorIdAndStartTimeLessThanAndEndTimeGreaterThan(doctorId, end, start);

        boolean hasRealClash = clashes.stream()
                .filter(a -> !shouldIgnoreForClash(a))
                .anyMatch(a -> ignoreAppointmentId == null || !a.getId().equals(ignoreAppointmentId));

        if (hasRealClash) {
            throw new BadRequestException("Doctor already has an appointment in this time range");
        }
    }

    private void ensureNoPatientClash(String patientId, LocalDateTime start, LocalDateTime end, UUID ignoreAppointmentId) {
        if (patientId == null || patientId.isBlank()) {
            throw new BadRequestException("patientId is required");
        }

        List<Appointment> patientAppointments = appointmentRepository.findByPatientId(patientId);

        boolean hasRealClash = patientAppointments.stream()
                .filter(a -> !shouldIgnoreForClash(a))
                .filter(a -> ignoreAppointmentId == null || !a.getId().equals(ignoreAppointmentId))
                .anyMatch(a ->
                        a.getStartTime() != null &&
                        a.getEndTime() != null &&
                        start.isBefore(a.getEndTime()) &&
                        a.getStartTime().isBefore(end)
                );

        if (hasRealClash) {
            throw new BadRequestException("Patient already has another appointment in this time range");
        }
    }

    private boolean shouldIgnoreForClash(Appointment appointment) {
        return appointment.getStatus() == AppointmentStatus.CANCELLED
                || appointment.getStatus() == AppointmentStatus.REJECTED
                || appointment.getStatus() == AppointmentStatus.COMPLETED;
    }
}