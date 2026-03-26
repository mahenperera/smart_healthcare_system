package com.shc.appointment.service;

import com.shc.appointment.dto.AppointmentResponse;
import com.shc.appointment.dto.CreateAppointmentRequest;
import com.shc.appointment.dto.UpdateAppointmentRequest;
import com.shc.appointment.enums.AppointmentStatus;

import java.util.List;
import java.util.UUID;

public interface AppointmentService {

    AppointmentResponse create(CreateAppointmentRequest request);

    AppointmentResponse getById(UUID id);

    List<AppointmentResponse> list(String patientId, String doctorId);

    AppointmentResponse update(UUID id, UpdateAppointmentRequest request);

    AppointmentResponse cancel(UUID id);

    AppointmentResponse updateStatus(UUID id, AppointmentStatus status);
}