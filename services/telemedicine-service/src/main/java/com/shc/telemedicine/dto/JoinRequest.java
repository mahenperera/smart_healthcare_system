package com.shc.telemedicine.dto;

import com.shc.telemedicine.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JoinRequest {
    @NotBlank
    private String userId;

    @NotNull
    private UserRole role;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}