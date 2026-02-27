package com.ecocycle.backend.user;

import com.ecocycle.backend.user.dto.request.UpdateUserRequest;
import com.ecocycle.backend.user.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getUserByUsername(String username);
    List<User> getUsers();
    User updateUser(UUID userId, UpdateUserRequest request);
    User deleteUser(UUID userId);
}
