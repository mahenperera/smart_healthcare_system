package com.shc.doctor.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AuthUtil {

    public String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Map) {
            Map<String, String> details = (Map<String, String>) auth.getDetails();
            return details.get("userId");
        }
        return null;
    }

    public String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Map) {
            Map<String, String> details = (Map<String, String>) auth.getDetails();
            return details.get("role");
        }
        return null;
    }

    public boolean isDoctor() {
        String role = getCurrentUserRole();
        return "DOCTOR".equals(role);
    }

    public boolean isPatient() {
        String role = getCurrentUserRole();
        return "PATIENT".equals(role);
    }

    public boolean isAdmin() {
        String role = getCurrentUserRole();
        return "ADMIN".equals(role);
    }
}