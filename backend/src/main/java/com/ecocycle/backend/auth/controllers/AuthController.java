package com.ecocycle.backend.auth.controllers;

import com.ecocycle.backend.auth.dto.request.SignupRequest;
import com.ecocycle.backend.auth.dto.response.RefreshResponse;
import com.ecocycle.backend.auth.dto.response.SignupResponse;
import com.ecocycle.backend.auth.service.AuthService;
import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.auth.dto.response.LoginResponse;
import com.ecocycle.backend.auth.dto.request.LoginRequest;
import com.ecocycle.backend.security.jwt.JwtService;
import com.ecocycle.backend.user.domain.User;
import com.ecocycle.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(
            @Valid @RequestBody SignupRequest signupRequest
    ) {
        User createdUser = authService.createUser(signupRequest);

        SignupResponse signupResponse = new SignupResponse(
                createdUser.getId(),
                createdUser.getUsername(),
                createdUser.getEmail()
        );

        ApiResponse<SignupResponse> apiResponse = ApiResponse.<SignupResponse>builder()
                .success(true)
                .message("Signup Successful.")
                .data(signupResponse)
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login (
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse httpResponse
    ) {
        UserDetails userDetails = authService.authenticate(loginRequest, httpResponse);
        String accessToken = jwtService.generateAccessToken(userDetails);
        User user = userService.getUserByUsername(loginRequest.getUsername());

        LoginResponse loginResponse = new LoginResponse(
                accessToken,
                user.getUsername(),
                user.getRoles()
        );

        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login Successful.")
                .data(loginResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

//    TODO: REFRESH
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshResponse>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String token
    ) {
        String accessToken = authService.refreshToken(token);
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);

        RefreshResponse refreshResponse = new RefreshResponse(
                accessToken,
                user.getUsername(),
                user.getRoles()
        );

        ApiResponse<RefreshResponse> apiResponse = ApiResponse.<RefreshResponse>builder()
                .success(true)
                .message("Login Successful.")
                .data(refreshResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

//    TODO: LOGOUT
}
