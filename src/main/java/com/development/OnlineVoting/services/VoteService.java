package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.Vote.VoteDetailRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteResponseDTO;

import java.util.List;
import java.util.UUID;

public interface VoteService {
    VoteResponseDTO CreateVote(VoteRequestDTO voteRequestDTO);

    VoteResponseDTO GetVoteById(UUID voteId);

    List<VoteResponseDTO> GetAllVotes();
    VoteResponseDTO UpdateVote(UUID voteId, VoteDetailRequestDTO voteDetailRequestDto);
    void DeleteVote(UUID voteId);
}
