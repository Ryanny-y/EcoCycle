package com.ecocycle.backend.material.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class MaterialAlreadyExists extends RuntimeException {
    public MaterialAlreadyExists(String message) {
        super(message);
    }
}
