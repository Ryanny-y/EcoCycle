package com.ecocycle.backend.common.web;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiErrorResponse {
    @Builder.Default
    private boolean success = false;
    private String message;
    private int status;
    private String code;
    private LocalDateTime timestamp;

}
