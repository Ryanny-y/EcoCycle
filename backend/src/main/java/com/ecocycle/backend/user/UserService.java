package com.ecocycle.backend.user;

import com.ecocycle.backend.user.model.User;

public interface UserService {
    User getUserByUsername(String username);
}
