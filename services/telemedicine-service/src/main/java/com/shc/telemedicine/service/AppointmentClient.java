package com.shc.telemedicine.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AppointmentClient {
    private final RestTemplate rest;
    private final String baseUrl;

    public AppointmentClient(RestTemplate rest,
                             @Value("${appointment.baseUrl}") String baseUrl) {
        this.rest = rest;
        this.baseUrl = baseUrl;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getAppointment(String appointmentId) {
        // appointment-service should have GET /api/appointments/{id}
        String url = baseUrl + "/api/appointments/" + appointmentId;
        return rest.getForObject(url, Map.class);
    }
}