package com.shc.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        if (secretKey == null || secretKey.isEmpty()) {
            System.err.println("STRIPE_SECRET_KEY is NOT set!");
            return;
        }
        
        // Stripe keys are typically 107 characters
        if (secretKey.length() < 100) {
            System.err.println("WARNING: STRIPE_SECRET_KEY seems too short (" + secretKey.length() + " chars). It might be truncated.");
        }
        
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(Double amount, String currency) throws StripeException {
        // Stripe amounts are in cents
        long amountInCents = (long) (amount * 100);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
}
