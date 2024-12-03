package com.development.OnlineVoting.repositories;

import com.development.OnlineVoting.entities.UserVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserVoteRepository extends JpaRepository<UserVote, UUID>{
    UserVote findByUser_UserIdAndVote_VoteIdAndOption_OptionId(UUID userId, UUID voteId, UUID optionId);
}
