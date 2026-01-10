package com.ecocycle.backend.auth.service;

import com.ecocycle.backend.auth.dto.request.LoginRequest;
import com.ecocycle.backend.auth.dto.request.SignupRequest;
import com.ecocycle.backend.auth.exceptions.InvalidCredentialsException;
import com.ecocycle.backend.security.UserPrincipal;
import com.ecocycle.backend.security.jwt.JwtService;
import com.ecocycle.backend.user.domain.Roles;
import com.ecocycle.backend.user.domain.User;
import com.ecocycle.backend.user.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public User createUser(SignupRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .roles(new HashSet<>(Set.of(Roles.ADMIN)))
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public UserDetails authenticate(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Username or Password is incorrect."));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = new UserPrincipal(user);
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            LocalDateTime refreshTokenExp = jwtService.getRefreshTokenExp(refreshToken);

            user.setRefreshToken(refreshToken);
            user.setRefreshTokenExp(refreshTokenExp);
            userRepository.save(user);
            setRefreshTokenToCookie(response, refreshToken, refreshTokenExp);

            return userDetails;
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Username or Password is incorrect.");
        }
    }

    private void setRefreshTokenToCookie(
            HttpServletResponse response,
            String refreshToken,
            LocalDateTime refreshTokenExp
    ) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .sameSite("None")
                .maxAge(Duration.between(LocalDateTime.now(), refreshTokenExp))
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        log.info("Refresh Token Cookie Set Successfully!");
    }

    private void clearRefreshTokenToCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(0)
                .sameSite("None")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        log.info("Refresh Token Cookie Cleared Successfully!");
    }
}
