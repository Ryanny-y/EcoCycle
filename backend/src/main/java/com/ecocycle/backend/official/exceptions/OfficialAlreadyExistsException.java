package com.ecocycle.backend.official.exceptions;

public class OfficialAlreadyExistsException extends RuntimeException {
    public OfficialAlreadyExistsException(String message) {
        super(message);
    }
}