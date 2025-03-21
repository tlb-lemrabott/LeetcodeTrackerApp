package com.leetcode.tracker.leetcodetracker.service;

import com.leetcode.tracker.leetcodetracker.entity.Problem;
import com.leetcode.tracker.leetcodetracker.entity.ProblemStatus;
import com.leetcode.tracker.leetcodetracker.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
