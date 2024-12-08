package com.development.OnlineVoting.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "UserVotes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "vote_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserVote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_vote_id", nullable = false, updatable = false)
    private UUID userVoteId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    private Option option;

    @ManyToOne
    @JoinColumn(name = "vote_id", nullable = false)
    private Vote vote;

    @Column(name = "voted_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date votedAt = new Date();
}
