package com.leetcodetracker.code.controller;

import com.leetcodetracker.code.entity.ProblemStatus;
import com.leetcodetracker.code.entity.User;
import com.leetcodetracker.code.repository.ProblemRepository;
import com.leetcodetracker.code.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        // Get only regular users, exclude admins
        List<User> users = userRepository.findByRole(com.leetcodetracker.code.entity.UserRole.USER);
        
        List<Map<String, Object>> userStats = users.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            
            // Calculate problem statistics
            long totalProblems = problemRepository.countByUser(user);
            long todoCount = problemRepository.countByUserAndStatus(user, ProblemStatus.TODO);
            long doingCount = problemRepository.countByUserAndStatus(user, ProblemStatus.DOING);
            long doneCount = problemRepository.countByUserAndStatus(user, ProblemStatus.DONE);
            
            Map<String, Object> progress = new HashMap<>();
            progress.put("total", totalProblems);
            progress.put("todo", todoCount);
            progress.put("doing", doingCount);
            progress.put("done", doneCount);
            
            userData.put("progress", progress);
            
            return userData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(userStats);
    }

    @GetMapping("/users/{userId}/problems")
    public ResponseEntity<List<Map<String, Object>>> getUserProblems(@PathVariable String userId) {
        // Search only from users with role USER, otherwise return RuntimeException("User not found")
        User user = userRepository.findById(java.util.UUID.fromString(userId))
                .filter(u -> u.getRole() == com.leetcodetracker.code.entity.UserRole.USER)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Map<String, Object>> problems = problemRepository.findByUser(user).stream()
                .map(problem -> {
                    Map<String, Object> problemData = new HashMap<>();
                    problemData.put("problemId", problem.getProblemId());
                    problemData.put("problemName", problem.getProblemName());
                    problemData.put("comment", problem.getComment());
                    problemData.put("link", problem.getLink());
                    problemData.put("status", problem.getStatus());
                    problemData.put("level", problem.getLevel());
                    problemData.put("timePosted", problem.getTimePosted());
                    problemData.put("doneTime", problem.getDoneTime());
                    return problemData;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        // Make sure counted users have role USER and no ADMIN among them
        long totalUsers = userRepository.findByRole(com.leetcodetracker.code.entity.UserRole.USER).size();
        long totalProblems = problemRepository.count();
        long totalTodo = problemRepository.countByUserAndStatus(null, ProblemStatus.TODO);
        long totalDoing = problemRepository.countByUserAndStatus(null, ProblemStatus.DOING);
        long totalDone = problemRepository.countByUserAndStatus(null, ProblemStatus.DONE);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalProblems", totalProblems);
        
        Map<String, Object> problemStats = new HashMap<>();
        problemStats.put("todo", totalTodo);
        problemStats.put("doing", totalDoing);
        problemStats.put("done", totalDone);
        stats.put("problemStats", problemStats);
        
        return ResponseEntity.ok(stats);
    }
}
