package com.ecocycle.backend.user;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import com.ecocycle.backend.user.dto.UserDto;
import com.ecocycle.backend.user.dto.request.UpdateUserRequest;
import com.ecocycle.backend.user.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class UserController {

    private final UserService userService;
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

    @RateLimit(limit = 50, duration = 1)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable("id") UUID userId,
            @Valid @RequestBody UpdateUserRequest updateUserRequest
    ) {
        User updatedUser = userService.updateUser(userId, updateUserRequest);

        UserDto updatedUserDto = userMapper.toDto(updatedUser);

        ApiResponse<UserDto> apiResponse = ApiResponse.<UserDto>builder()
                .success(true)
                .message("User Updated Successfully.")
                .data(updatedUserDto)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 50, duration = 1)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable("id") UUID userId
    ) {
        User deletedUser = userService.deleteUser(userId);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("User " + deletedUser.getUsername() + " Deleted Successfully.")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
