package com.shc.auth.service;

import com.shc.auth.config.JwtService;
import com.shc.auth.dto.*;
import com.shc.auth.entity.AppUser;
import com.shc.auth.exception.*;
import com.shc.auth.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${service.doctor.url:http://doctor-service:8083/api/doctors}")
    private String doctorServiceUrl;

    @Value("${service.patient.url:http://patient-service:8082/api/patients}")
    private String patientServiceUrl;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate role
        if (!request.getRole().equalsIgnoreCase("PATIENT") && !request.getRole().equalsIgnoreCase("DOCTOR")) {
            throw new IllegalArgumentException("Invalid role. Only PATIENT or DOCTOR allowed.");
        }

        // Check if email already exists
        if (authRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        // Create user in auth database
        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());

        user = authRepository.save(user);

        // Call respective service to create profile
        try {
            if ("DOCTOR".equalsIgnoreCase(request.getRole())) {
                createDoctorProfile(user.getId().toString(), request);
                return new AuthResponse(
                        user.getId().toString(),
                        user.getEmail(),
                        request.getName(),
                        user.getRole(),
                        null,
                        false,
                        "Doctor registration successful. Awaiting admin verification."
                );
            } else {
                createPatientProfile(user.getId().toString(), request);
                // Generate token using your JwtService
                String token = jwtService.generateToken(user);
                return new AuthResponse(
                        user.getId().toString(),
                        user.getEmail(),
                        request.getName(),
                        user.getRole(),
                        token,
                        true,
                        "Patient registration successful"
                );
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user profile: " + e.getMessage());
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Find user
        AppUser user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Check if doctor is rejected
        if ("DOCTOR".equalsIgnoreCase(user.getRole()) && user.isRejected()) {
            throw new AccountRejectedException("Your application has been rejected by the administrator. Please contact support for more details.");
        }

        // Check if doctor is verified
        if ("DOCTOR".equalsIgnoreCase(user.getRole()) && !user.isVerified()) {
            throw new AccountLockedException("Your account is pending admin verification");
        }

        // Check if account is enabled
        if (!user.isEnabled()) {
            throw new AccountDisabledException("Your account is not enabled. Please contact support.");
        }

        // Generate JWT token using your JwtService
        String token = jwtService.generateToken(user);

        String fullName = fetchFullName(user.getId().toString(), user.getRole());

        return new AuthResponse(
                user.getId().toString(),
                user.getEmail(),
                fullName,
                user.getRole(),
                token,
                user.isVerified(),
                "Login successful"
        );
    }

    @Override
    @Transactional
    public AuthResponse verifyDoctor(VerifyDoctorRequest request) {
        UUID userId = UUID.fromString(request.getUserId());
        AppUser user = authRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!"DOCTOR".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("User is not a doctor");
        }

        if (request.isApproved()) {
            user.setVerified(true);
            user.setEnabled(true);
            user.setRejected(false);
        } else {
            user.setVerified(false);
            user.setEnabled(false);
            user.setRejected(true); // Mark as rejected
        }

        authRepository.save(user);

        String message = request.isApproved() ? "Doctor verified successfully" : "Doctor verification rejected";
        String fullName = fetchFullName(user.getId().toString(), user.getRole());

        return new AuthResponse(
                user.getId().toString(),
                user.getEmail(),
                fullName,
                user.getRole(),
                null,
                user.isVerified(),
                message
        );
    }

    @Override
    public List<AppUser> getPendingDoctors() {
        return authRepository.findByRoleAndVerifiedAndRejected("DOCTOR", false, false);
    }

    @Override
    public AppUser getUserById(String userId) {
        return authRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public AppUser getUserByEmail(String email) {
        return authRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void createDoctorProfile(String userId, RegisterRequest request) {
        CreateDoctorRequest doctorRequest = new CreateDoctorRequest();
        doctorRequest.setUserId(userId);
        doctorRequest.setFullName(request.getName());
        doctorRequest.setSpecialization(request.getSpecialization());
        doctorRequest.setHospital(request.getHospital());
        doctorRequest.setSlmcNumber(request.getSlmcNumber());

        restTemplate.postForEntity(doctorServiceUrl, doctorRequest, String.class);
    }

    private void createPatientProfile(String userId, RegisterRequest request) {
        CreatePatientRequest patientRequest = new CreatePatientRequest();
        patientRequest.setUserId(userId);
        patientRequest.setEmail(request.getEmail());
        patientRequest.setNic(request.getNic());
        patientRequest.setName(request.getName());
        patientRequest.setGender(request.getGender());
        patientRequest.setPhone(request.getPhone());

        restTemplate.postForEntity(patientServiceUrl, patientRequest, String.class);
    }

    private String fetchFullName(String userId, String role) {
        if ("ADMIN".equalsIgnoreCase(role)) return null;
        try {
            ParameterizedTypeReference<Map<String, Object>> typeRef = new ParameterizedTypeReference<Map<String, Object>>() {};
            if ("DOCTOR".equalsIgnoreCase(role)) {
                String url = doctorServiceUrl + "/" + userId;
                Map<String, Object> response = restTemplate.exchange(url, HttpMethod.GET, null, typeRef).getBody();
                return response != null ? (String) response.get("fullName") : null;
            } else if ("PATIENT".equalsIgnoreCase(role)) {
                String url = patientServiceUrl + "/user/" + userId;
                Map<String, Object> response = restTemplate.exchange(url, HttpMethod.GET, null, typeRef).getBody();
                return response != null ? (String) response.get("name") : null;
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch full name for user " + userId + ": " + e.getMessage());
        }
        return null;
    }
}