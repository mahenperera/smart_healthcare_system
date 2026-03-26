package com.shc.appointment.controller;

import com.shc.appointment.dto.AppointmentResponse;
import com.shc.appointment.dto.CreateAppointmentRequest;
import com.shc.appointment.dto.UpdateAppointmentRequest;
import com.shc.appointment.dto.UpdateStatusRequest;
import com.shc.appointment.exception.BadRequestException;
import com.shc.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentResponse created = appointmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public AppointmentResponse getById(@PathVariable String id) {
        return appointmentService.getById(parseUUID(id));
    }

    @GetMapping
    public List<AppointmentResponse> list(
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String doctorId
    ) {
        return appointmentService.list(patientId, doctorId);
    }

    @PutMapping("/{id}")
    public AppointmentResponse update(
            @PathVariable String id,
            @RequestBody UpdateAppointmentRequest request
    ) {
        return appointmentService.update(parseUUID(id), request);
    }

    @PatchMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable String id) {
        return appointmentService.cancel(parseUUID(id));
    }

    @PatchMapping("/{id}/status")
    public AppointmentResponse updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return appointmentService.updateStatus(parseUUID(id), request.getStatus());
    }

    private UUID parseUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (Exception e) {
            throw new BadRequestException("Invalid UUID: " + id);
        }
    }
}