package com.leetcodetracker.code.entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID problemId;
    private String problemName;
    private String comment;
    private String link;
    private Date timePosted;
    private Date doneTime;
    @Enumerated(EnumType.STRING)
    private ProblemStatus status;
    @Enumerated(EnumType.STRING)
    private ProblemLevel level;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
