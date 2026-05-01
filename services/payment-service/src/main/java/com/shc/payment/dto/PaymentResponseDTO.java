package com.shc.payment.dto;

import java.util.UUID;

public class PaymentResponseDTO {
    private UUID paymentId;
    private String clientSecret;
    private String status;

    // Getters and Setters
    public UUID getPaymentId() { return paymentId; }
    public void setPaymentId(UUID paymentId) { this.paymentId = paymentId; }

    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
