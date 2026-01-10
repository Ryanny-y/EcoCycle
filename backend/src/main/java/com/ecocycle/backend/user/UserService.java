package com.ecocycle.backend.user;

import com.ecocycle.backend.user.domain.User;

public interface UserService {
    User getUserByUsername(String username);
}
