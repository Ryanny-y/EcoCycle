package com.ecocycle.backend.achievement.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AchievementAlreadyExists extends RuntimeException {
    public AchievementAlreadyExists(String message) {
        super(message);
    }
}