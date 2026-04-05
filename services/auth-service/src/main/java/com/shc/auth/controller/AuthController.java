package com.shc.auth.controller;

import com.shc.auth.dto.*;
import com.shc.auth.entity.AppUser;
import com.shc.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-doctor")
    public ResponseEntity<AuthResponse> verifyDoctor(@Valid @RequestBody VerifyDoctorRequest request) {
        AuthResponse response = authService.verifyDoctor(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-doctors")
    public ResponseEntity<List<AppUser>> getPendingDoctors() {
        List<AppUser> doctors = authService.getPendingDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<AppUser> getUserById(@PathVariable String userId) {
        AppUser user = authService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/email/{email}")
    public ResponseEntity<AppUser> getUserByEmail(@PathVariable String email) {
        AppUser user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}