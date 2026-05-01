package com.shc.payment.repository;

import com.shc.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
    Optional<Payment> findByAppointmentId(String appointmentId);
    java.util.List<Payment> findByPatientId(String patientId);
}
