package com.shc.payment.controller;

import com.shc.payment.dto.PaymentRequestDTO;
import com.shc.payment.dto.PaymentResponseDTO;
import com.shc.payment.entity.Payment;
import com.shc.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request));
    }

    @PostMapping("/confirm/{id}")
    public ResponseEntity<Payment> confirmPayment(@PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.confirmPayment(id));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Payment> getPaymentByAppointmentId(@PathVariable String appointmentId) {
        Payment payment = paymentService.getPaymentByAppointmentId(appointmentId);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<java.util.List<Payment>> getPaymentsByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(paymentService.getPaymentsByPatientId(patientId));
    }
}
