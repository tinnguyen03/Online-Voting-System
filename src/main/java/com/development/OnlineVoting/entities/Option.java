package com.development.OnlineVoting.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "Options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "option_id", nullable = false, updatable = false, length = 36)
    private UUID optionId;

    @ManyToOne
    @JoinColumn(name = "vote_id", nullable = false)
    private Vote vote;

    @Column(name = "content", nullable = false, length = 255)
    private String content;

    @Column(name = "votes_count", nullable = false)
    private Integer votesCount = 0;

    @OneToMany(mappedBy = "option", cascade = CascadeType.REMOVE)
    private Set<UserVote> userVotes;
}

