package com.shc.payment.service;

import com.shc.payment.dto.PaymentRequestDTO;
import com.shc.payment.dto.PaymentResponseDTO;
import com.shc.payment.entity.Payment;

import java.util.UUID;

public interface PaymentService {
    PaymentResponseDTO createPaymentIntent(PaymentRequestDTO request);
    Payment confirmPayment(UUID paymentId);
    Payment getPaymentByAppointmentId(String appointmentId);
    java.util.List<Payment> getPaymentsByPatientId(String patientId);
}
