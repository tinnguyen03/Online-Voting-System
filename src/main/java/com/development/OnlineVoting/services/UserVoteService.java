package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;

import java.util.UUID;

public interface UserVoteService {

    UserVoteResponseDTO castVote(UserVoteRequestDTO userVoteRequestDTO);
    void DeleteUserVote(UUID userId, UUID voteId);
    UserVoteResponseDTO  FindVoteOption(UUID userId, UUID voteId);
    boolean isUserVoted(UUID userId, UUID voteId);
}
