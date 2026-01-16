package com.ecocycle.backend.exchangeitem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ExchangeItemAlreadyExists extends RuntimeException {
    public ExchangeItemAlreadyExists(String message) {
        super(message);
    }
}