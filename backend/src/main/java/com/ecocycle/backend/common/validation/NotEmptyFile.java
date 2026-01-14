package com.ecocycle.backend.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NotEmptyFileValidator.class)
@Documented
public @interface NotEmptyFile {
    String message() default "Image is required.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
