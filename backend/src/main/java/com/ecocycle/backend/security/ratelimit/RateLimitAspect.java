package com.ecocycle.backend.security.ratelimit;

import com.ecocycle.backend.security.UserPrincipal;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

    private final HttpServletRequest request;

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Around("@annotation(com.ecocycle.backend.security.ratelimit.RateLimit)")
    public Object applyRateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimit rateLimit = method.getAnnotation(RateLimit.class);

        String key = buildKey(method);

        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket(rateLimit));

        if(bucket.tryConsume(1)) {
            return joinPoint.proceed();
        }

        throw new RateLimitException("Too many requests. Please slow down.");
    }

    private String buildKey(Method method) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String identifier;

        if (auth != null && auth.getPrincipal() instanceof UserPrincipal user) {
            identifier = "USER_" + user.getUser().getId();
        } else {
            identifier = "IP_" + request.getRemoteAddr();
        }

        return identifier + ":" + method.getName();
    }

    private Bucket createBucket(RateLimit rateLimit) {
        Duration duration = Duration.of(rateLimit.duration(), rateLimit.unit().toChronoUnit());

        Refill refill = Refill.greedy(rateLimit.limit(), duration);
        Bandwidth limit = Bandwidth.classic(rateLimit.limit(), refill);

        return Bucket.builder().addLimit(limit).build();
    }
}
