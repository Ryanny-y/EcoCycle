package com.ecocycle.backend.official.exceptions;

public class OfficialNotFoundException extends RuntimeException {
    public OfficialNotFoundException(String message) {
        super(message);
    }
}