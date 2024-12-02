package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.Vote.VoteDetailRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteResponseDTO;
import com.development.OnlineVoting.services.VoteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VoteServiceImpl implements VoteService {
    @Override
    public VoteResponseDTO CreateVote(VoteRequestDTO voteRequestDTO) {
        return null;
    }

    @Override
    public VoteResponseDTO GetVoteById(UUID voteId) {
        return null;
    }

    @Override
    public List<VoteResponseDTO> GetAllVotes() {
        return null;
    }

    @Override
    public VoteResponseDTO UpdateVote(UUID voteId, VoteDetailRequestDTO voteDetailRequestDto) {
        return null;
    }

    @Override
    public void DeleteVote(UUID voteId) {

    }
}
