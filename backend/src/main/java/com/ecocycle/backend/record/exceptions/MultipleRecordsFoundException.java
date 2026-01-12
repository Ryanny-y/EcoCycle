package com.ecocycle.backend.record.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class MultipleRecordsFoundException extends RuntimeException {
    public MultipleRecordsFoundException(String message) {
        super(message);
    }
}
