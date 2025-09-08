package com.leetcodetracker.code.service;

import com.leetcodetracker.code.entity.User;
import com.leetcodetracker.code.entity.UserRole;
import com.leetcodetracker.code.repository.UserRepository;
import com.leetcodetracker.code.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public Map<String, Object> signup(String username, String email, String password, UserRole role) {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();

        userRepository.save(user);

        // Return user info without token - user needs to login to get token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("user", Map.of(
                "userId", user.getUserId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));

        return response;
    }

    public Map<String, Object> login(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                    "userId", user.getUserId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));

            return response;
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }
}
