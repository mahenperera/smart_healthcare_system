package com.shc.auth.dto;

public class AuthResponse {

    private String userId;
    private String email;
    private String fullName;
    private String role;
    private String token;
    private boolean verified;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(String userId, String email, String fullName, String role, String token, boolean verified, String message) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.token = token;
        this.verified = verified;
        this.message = message;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}