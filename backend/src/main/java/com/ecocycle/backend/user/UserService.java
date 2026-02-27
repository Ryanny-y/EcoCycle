package com.ecocycle.backend.user;

import com.ecocycle.backend.user.model.User;

import java.util.List;

public interface UserService {
    User getUserByUsername(String username);
    List<User> getUsers();
}
