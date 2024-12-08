package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.Vote.VoteDetailRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteOnlyResponseDTO;
import com.development.OnlineVoting.dtos.Vote.VoteRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface VoteService {
    VoteResponseDTO CreateVote(VoteRequestDTO voteRequestDTO);

    VoteResponseDTO GetVoteById(UUID voteId);

    Page<VoteOnlyResponseDTO> GetAllVotes(int page, int limit);
    VoteOnlyResponseDTO UpdateVote(UUID voteId, VoteDetailRequestDTO voteDetailRequestDto);
    void DeleteVote(UUID voteId);
}
