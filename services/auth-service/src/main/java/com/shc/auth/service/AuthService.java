package com.shc.auth.service;

import com.shc.auth.dto.*;
import com.shc.auth.entity.AppUser;

import java.util.List;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse verifyDoctor(VerifyDoctorRequest request);

    List<AppUser> getPendingDoctors();

    AppUser getUserById(String userId);

    AppUser getUserByEmail(String email);
}