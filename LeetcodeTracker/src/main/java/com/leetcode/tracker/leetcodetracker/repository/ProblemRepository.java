package com.leetcode.tracker.leetcodetracker.repository;

import com.leetcode.tracker.leetcodetracker.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    //Optional<Problem> findProblemByProblemDate(Date date);
}
