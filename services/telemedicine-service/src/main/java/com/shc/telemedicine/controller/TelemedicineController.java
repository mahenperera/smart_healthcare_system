package com.shc.telemedicine.controller;

import com.shc.telemedicine.dto.CreateSessionRequest;
import com.shc.telemedicine.dto.JoinRequest;
import com.shc.telemedicine.dto.JoinResponse;
import com.shc.telemedicine.dto.SessionResponse;
import com.shc.telemedicine.service.TelemedicineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/telemedicine")
@CrossOrigin(origins = "*") // ok for now; lock later
public class TelemedicineController {

    private final TelemedicineService service;

    public TelemedicineController(TelemedicineService service) {
        this.service = service;
    }

    // Create or get a session for an ONLINE appointment
    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> createOrGet(@Valid @RequestBody CreateSessionRequest req) {
        return ResponseEntity.ok(service.createOrGetSession(req.getAppointmentId()));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<SessionResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(service.getSession(id));
    }

    @PostMapping("/sessions/{id}/join")
    public ResponseEntity<JoinResponse> join(@PathVariable String id, @Valid @RequestBody JoinRequest req) {
        return ResponseEntity.ok(service.join(id, req));
    }
}