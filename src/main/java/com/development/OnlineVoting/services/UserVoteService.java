package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;

import java.util.UUID;

public interface UserVoteService {

    UserVoteResponseDTO castVote(UserVoteRequestDTO userVoteRequestDTO);
    void DeleteUserVote(UserVoteRequestDTO userVoteRequestDTO);

    boolean isUserVoted(UUID userId, UUID voteId);
}
