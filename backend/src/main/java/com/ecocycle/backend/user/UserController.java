package com.ecocycle.backend.user;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import com.ecocycle.backend.user.dto.UserDto;
import com.ecocycle.backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class UserController {

    private final UserServiceImpl userService;
    private final UserMapper userMapper;

    @RateLimit(limit = 50, duration = 1)
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers() {
        List<User> users = userService.getUsers();

        List<UserDto> userDtos = users.stream().map(userMapper::toDto).toList();

        ApiResponse<List<UserDto>> apiResponse = ApiResponse.<List<UserDto>>builder()
                .success(true)
                .message("Users Retrieved.")
                .data(userDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
