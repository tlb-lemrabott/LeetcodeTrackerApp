package com.leetcodetracker.code.controller;

import com.leetcodetracker.code.entity.UserRole;
import com.leetcodetracker.code.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest request) {
        try {
            // Determine role from request, default to USER if not specified or invalid
            UserRole role = UserRole.USER; // Default role
            if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
                try {
                    role = UserRole.valueOf(request.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid role provided, use default USER role
                    role = UserRole.USER;
                }
            }
            
            Map<String, Object> response = authenticationService.signup(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    role
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> response = authenticationService.login(
                    request.getUsername(),
                    request.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Request DTOs
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String role; // Optional role field (USER or ADMIN)

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
