package com.ecocycle.backend.exchangeitem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ExchangeItemNotFoundException extends RuntimeException {
    public ExchangeItemNotFoundException(String message) {
        super(message);
    }
}