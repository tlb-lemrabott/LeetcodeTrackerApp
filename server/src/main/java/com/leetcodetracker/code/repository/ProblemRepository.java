package com.leetcodetracker.code.repository;

import com.leetcodetracker.code.entity.Problem;
import com.leetcodetracker.code.entity.User;
import com.leetcodetracker.code.entity.ProblemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    List<Problem> findByUser(User user);
    Optional<Problem> findByProblemIdAndUser(UUID problemId, User user);
    List<Problem> findByUserAndStatus(User user, ProblemStatus status);
    long countByUser(User user);
    long countByUserAndStatus(User user, ProblemStatus status);
    long countByStatus(ProblemStatus status);
}
