package com.leetcode.tracker.leetcodetracker.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcode.tracker.leetcodetracker.entity.Problem;
import com.leetcode.tracker.leetcodetracker.entity.ProblemStatus;
import com.leetcode.tracker.leetcodetracker.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Problem createProblem(Problem problem) {
        System.out.println("create problem called!");
        problem.setTimePosted(new Date());
        return repository.save(problem);
    }

    public List<Problem> createProblemsBulk(List<Problem> problems) {
        System.out.println("create problems bulk called! Count: " + problems.size());
        Date currentTime = new Date();
        
        // Set timePosted for all problems and doneTime for DONE problems
        for (Problem problem : problems) {
            problem.setTimePosted(currentTime);
            if (problem.getStatus() == ProblemStatus.DONE) {
                problem.setDoneTime(currentTime);
            }
        }
        
        return repository.saveAll(problems);
    }
    public List<Problem> getAllProblems() {
        return repository.findAll();
    }
    public Optional<Problem> getProblemById(UUID id) {
        return repository.findById(id);
    }

    public Problem updateProblem(UUID id, Problem updateProblem) {
        return repository.findById(id).map(problem -> {
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
        repository.deleteById(id);
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
