package com.shc.appointment.scheduler;

import com.shc.appointment.entity.Appointment;
import com.shc.appointment.enums.AppointmentStatus;
import com.shc.appointment.repository.AppointmentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AppointmentReminderScheduler {

    private final AppointmentRepository appointmentRepository;
    private final RestTemplate restTemplate;

    public AppointmentReminderScheduler(AppointmentRepository appointmentRepository, RestTemplate restTemplate) {
        this.appointmentRepository = appointmentRepository;
        this.restTemplate = restTemplate;
    }

    // Run every hour to check for appointments starting in the next 24 hours
    @Scheduled(cron = "0 0 * * * *")
    public void sendUpcomingAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twentyFourHoursLater = now.plusHours(24);

        List<Appointment> upcomingAppointments = appointmentRepository.findByStatusAndReminderSentFalseAndStartTimeBetween(
                AppointmentStatus.CONFIRMED, now, twentyFourHoursLater
        );

        for (Appointment appointment : upcomingAppointments) {
            try {
                // Send reminder to patient
                sendNotification(
                        appointment.getPatientId(),
                        "Upcoming Appointment Reminder",
                        "Friendly reminder: You have an appointment tomorrow at " + appointment.getStartTime().toLocalTime(),
                        "APPOINTMENT"
                );

                // Mark as sent
                appointment.setReminderSent(true);
                appointmentRepository.save(appointment);
            } catch (Exception e) {
                System.err.println("Error processing reminder for appointment " + appointment.getId() + ": " + e.getMessage());
            }
        }
    }

    private void sendNotification(String userId, String title, String message, String type) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("userId", userId);
            request.put("title", title);
            request.put("message", message);
            request.put("type", type);
            // Assuming notification-service is on port 8088
            restTemplate.postForEntity("http://localhost:8088/api/notifications", request, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to send notification to user " + userId + ": " + e.getMessage());
        }
    }
}
