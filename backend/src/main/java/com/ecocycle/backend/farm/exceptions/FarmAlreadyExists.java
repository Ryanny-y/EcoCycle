package com.ecocycle.backend.farm.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class FarmAlreadyExists extends RuntimeException {
    public FarmAlreadyExists(String message) {
        super(message);
    }
}
