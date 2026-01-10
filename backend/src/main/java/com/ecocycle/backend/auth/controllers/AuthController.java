package com.ecocycle.backend.auth.controllers;

import com.ecocycle.backend.auth.service.AuthService;
import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.auth.dto.response.LoginResponse;
import com.ecocycle.backend.auth.dto.request.LoginRequest;
import com.ecocycle.backend.security.jwt.JwtService;
import com.ecocycle.backend.user.domain.User;
import com.ecocycle.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;


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
}
