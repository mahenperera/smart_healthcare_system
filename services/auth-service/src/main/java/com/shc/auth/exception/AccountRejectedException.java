package com.shc.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccountRejectedException extends RuntimeException {
    public AccountRejectedException(String message) {
        super(message);
    }
}
