package com.leetcodetracker.code.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcodetracker.code.entity.Problem;
import com.leetcodetracker.code.entity.ProblemStatus;
import com.leetcodetracker.code.entity.User;
import com.leetcodetracker.code.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProblemService {
    @Autowired
    private final ProblemRepository repository;
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }
    
    public Problem createProblem(Problem problem) {
        System.out.println("create problem called!");
        problem.setTimePosted(new Date());
        problem.setUser(getCurrentUser());
        return repository.save(problem);
    }

    public List<Problem> createProblemsBulk(List<Problem> problems) {
        System.out.println("create problems bulk called! Count: " + problems.size());
        Date currentTime = new Date();
        User currentUser = getCurrentUser();
        
        // Set timePosted for all problems and doneTime for DONE problems
        for (Problem problem : problems) {
            problem.setTimePosted(currentTime);
            problem.setUser(currentUser);
            if (problem.getStatus() == ProblemStatus.DONE) {
                problem.setDoneTime(currentTime);
            }
        }
        
        return repository.saveAll(problems);
    }
    public List<Problem> getAllProblems() {
        User currentUser = getCurrentUser();
        return repository.findByUser(currentUser);
    }
    
    public List<Problem> getAllProblemsForAdmin() {
        return repository.findAll();
    }
    
    public Optional<Problem> getProblemById(UUID id) {
        User currentUser = getCurrentUser();
        return repository.findByProblemIdAndUser(id, currentUser);
    }

    public Problem updateProblem(UUID id, Problem updateProblem) {
        User currentUser = getCurrentUser();
        return repository.findByProblemIdAndUser(id, currentUser).map(problem -> {
            problem.setProblemName(updateProblem.getProblemName());
            problem.setComment(updateProblem.getComment());
            problem.setLink(updateProblem.getLink());
            System.out.println("problem.getStatus() = " + problem.getStatus());
            problem.setStatus(updateProblem.getStatus());
            problem.setLevel(updateProblem.getLevel());
            if (updateProblem.getStatus() == ProblemStatus.DONE) {
                System.out.println("update has been called in the backend");
                problem.setDoneTime(new Date());
            }

            return repository.save(problem);
        }).orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    public void deleteProblem(UUID id) {
        User currentUser = getCurrentUser();
        Optional<Problem> problem = repository.findByProblemIdAndUser(id, currentUser);
        if (problem.isPresent()) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Problem not found");
        }
    }

    public List<Problem> importProblemsFromJsonFile(MultipartFile file) throws IOException {
        System.out.println("import problems from JSON file called! File: " + file.getOriginalFilename());
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (!file.getOriginalFilename().toLowerCase().endsWith(".json")) {
            throw new IllegalArgumentException("File must be a JSON file");
        }
        
        // Parse JSON file
        ObjectMapper objectMapper = new ObjectMapper();
        List<Problem> problems;
        
        try {
            problems = objectMapper.readValue(file.getInputStream(), new TypeReference<List<Problem>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON format: " + e.getMessage());
        }
        
        // Validate problems list
        if (problems == null || problems.isEmpty()) {
            throw new IllegalArgumentException("No problems found in the JSON file");
        }
        
        // Use existing bulk create method
        return createProblemsBulk(problems);
    }
}
