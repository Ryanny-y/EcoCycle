package com.ecocycle.backend.security.ratelimit;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {
    int limit();
    long duration();
    TimeUnit unit() default TimeUnit.MINUTES;
}