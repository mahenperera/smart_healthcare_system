package com.shc.appointment.mapper;

import com.shc.appointment.dto.AppointmentResponse;
import com.shc.appointment.dto.CreateAppointmentRequest;
import com.shc.appointment.dto.UpdateAppointmentRequest;
import com.shc.appointment.entity.Appointment;
import com.shc.appointment.enums.AppointmentType;

public class AppointmentMapper {

    public static Appointment toEntity(CreateAppointmentRequest req) {
        Appointment a = new Appointment();
        a.setPatientId(req.getPatientId());
        a.setDoctorId(req.getDoctorId());
        a.setSpecialty(req.getSpecialty());
        a.setStartTime(req.getStartTime());
        a.setEndTime(req.getEndTime());
        a.setReason(req.getReason());

        // Default to PHYSICAL if not provided
        a.setAppointmentType(req.getAppointmentType() != null ? req.getAppointmentType() : AppointmentType.PHYSICAL);
        a.setAvailabilitySlotId(req.getAvailabilitySlotId());
 
        // status default handled in entity
        return a;
    }

    public static void applyUpdate(Appointment a, UpdateAppointmentRequest req) {
        if (req.getStartTime() != null) a.setStartTime(req.getStartTime());
        if (req.getEndTime() != null) a.setEndTime(req.getEndTime());
        if (req.getReason() != null) a.setReason(req.getReason());

        // (optional) if later you allow changing appointmentType in update request,
        // you can add it here.
    }

    public static AppointmentResponse toResponse(Appointment a) {
        AppointmentResponse res = new AppointmentResponse();
        res.setId(a.getId());
        res.setPatientId(a.getPatientId());
        res.setDoctorId(a.getDoctorId());
        res.setSpecialty(a.getSpecialty());
        res.setStartTime(a.getStartTime());
        res.setEndTime(a.getEndTime());
        res.setStatus(a.getStatus());
        res.setAppointmentType(a.getAppointmentType());
        res.setReason(a.getReason());
        res.setCreatedAt(a.getCreatedAt());
        res.setUpdatedAt(a.getUpdatedAt());
        res.setAvailabilitySlotId(a.getAvailabilitySlotId());
        return res;
    }
}