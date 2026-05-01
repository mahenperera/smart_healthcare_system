package com.shc.payment.service.serviceImpl;

import com.shc.payment.dto.PaymentRequestDTO;
import com.shc.payment.dto.PaymentResponseDTO;
import com.shc.payment.entity.Payment;
import com.shc.payment.enums.PaymentStatus;
import com.shc.payment.repository.PaymentRepository;
import com.shc.payment.service.PaymentService;
import com.shc.payment.service.StripeService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    @Override
    public PaymentResponseDTO createPaymentIntent(PaymentRequestDTO request) {
        try {
            // 1. Create record in local DB
            Payment payment = new Payment();
            payment.setPatientId(request.getPatientId());
            payment.setAppointmentId(request.getAppointmentId());
            payment.setAmount(request.getAmount());
            payment.setCurrency(request.getCurrency());
            payment.setStatus(PaymentStatus.PENDING);
            payment = paymentRepository.save(payment);

            // 2. Create Stripe PaymentIntent
            PaymentIntent intent = stripeService.createPaymentIntent(request.getAmount(), request.getCurrency());

            // 3. Update record with Stripe ID
            payment.setStripePaymentIntentId(intent.getId());
            paymentRepository.save(payment);

            // 4. Return response with clientSecret
            PaymentResponseDTO response = new PaymentResponseDTO();
            response.setPaymentId(payment.getId());
            response.setClientSecret(intent.getClientSecret());
            response.setStatus(payment.getStatus().name());

            // Optional: Send notification that payment intent was created
            sendNotification(payment.getPatientId(), "Payment Initialized", "Please complete your payment for appointment " + payment.getAppointmentId(), "PAYMENT");

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage());
        }
    }

    @Override
    public Payment confirmPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.SUCCESS);
        payment = paymentRepository.save(payment);

        // 1. Update Appointment Status to CONFIRMED
        try {
            java.util.Map<String, String> statusRequest = new java.util.HashMap<>();
            statusRequest.put("status", "CONFIRMED");
            restTemplate.patchForObject("http://localhost:8084/api/appointments/" + payment.getAppointmentId() + "/status", statusRequest, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to update appointment status: " + e.getMessage());
        }

        // 2. Send Notification
        sendNotification(payment.getPatientId(), "Payment Successful", "Your payment for appointment " + payment.getAppointmentId() + " was successful.", "PAYMENT");

        return payment;
    }

    private void sendNotification(String userId, String title, String message, String type) {
        try {
            java.util.Map<String, Object> request = new java.util.HashMap<>();
            request.put("userId", userId);
            request.put("title", title);
            request.put("message", message);
            request.put("type", type);
            restTemplate.postForEntity("http://localhost:8088/api/notifications", request, Object.class);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }

    @Override
    public Payment getPaymentByAppointmentId(String appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId)
                .orElse(null);
    }

    @Override
    public java.util.List<Payment> getPaymentsByPatientId(String patientId) {
        return paymentRepository.findByPatientId(patientId);
    }
}
