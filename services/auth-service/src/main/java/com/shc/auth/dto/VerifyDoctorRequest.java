package com.shc.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyDoctorRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    private boolean approved; // true for approve, false for reject

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}