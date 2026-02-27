package com.ecocycle.backend.user;

import com.ecocycle.backend.user.dto.request.UpdateUserRequest;
import com.ecocycle.backend.user.exceptions.UserNotFoundException;
import com.ecocycle.backend.user.model.User;
import com.ecocycle.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User getUserByUsername(String username) {
        return userRepository.findByUsernameWithRole(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public User updateUser(UUID userId, UpdateUserRequest request) {
        User user = this.getUserById(userId);

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        if(!request.getPassword().isBlank()) {
            if(request.getConfirmPassword().isBlank()) {
                throw new IllegalArgumentException("Confirm Password is required.");
            }

            if(!request.getPassword().equals(request.getConfirmPassword())) {
                throw new IllegalArgumentException("Password and Confirm password do not match");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    public User deleteUser(UUID userId) {
        User user = this.getUserById(userId);
        userRepository.delete(user);
        return user;
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }
}
