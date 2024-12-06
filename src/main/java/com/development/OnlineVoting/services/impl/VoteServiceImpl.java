package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.Option.OptionCreateDTO;
import com.development.OnlineVoting.dtos.Option.OptionRequestDTO;
import com.development.OnlineVoting.dtos.Option.OptionResponseDTO;
import com.development.OnlineVoting.dtos.Vote.VoteDetailRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteOnlyResponseDTO;
import com.development.OnlineVoting.dtos.Vote.VoteRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteResponseDTO;
import com.development.OnlineVoting.entities.Option;
import com.development.OnlineVoting.entities.Vote;
import com.development.OnlineVoting.repositories.OptionRepository;
import com.development.OnlineVoting.repositories.UserRepository;
import com.development.OnlineVoting.repositories.VoteRepository;
import com.development.OnlineVoting.services.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class VoteServiceImpl implements VoteService {
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OptionRepository optionRepository;
    @Override
    public VoteResponseDTO CreateVote(VoteRequestDTO voteRequestDTO) {
        Vote vote = new Vote();
        vote.setTitle(voteRequestDTO.getTitle());
        vote.setDescription(voteRequestDTO.getDescription());
        vote.setExpiresAt(voteRequestDTO.getExpiresAt());
        vote.setStatus("Available");

        vote.setCreatedBy(userRepository.findById(voteRequestDTO.getCreatedBy())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + voteRequestDTO.getCreatedBy())));

        Vote savedVote = voteRepository.save(vote);
        Set<Option> options = new HashSet<>();
        for (OptionCreateDTO optionCreateDTO : voteRequestDTO.getOptions()) {
            Option option = new Option();
            option.setContent(optionCreateDTO.getContent());
            option.setVote(savedVote);
            options.add(option);
        }
        List<Option> savedOptions = optionRepository.saveAll(options);
        List<OptionResponseDTO> optionResponseDTOList = savedOptions.stream().map(option -> new OptionResponseDTO(option.getOptionId(), option.getContent(), option.getVotesCount())).toList();
        VoteResponseDTO voteResponseDTO = new VoteResponseDTO();
        voteResponseDTO.setVoteId(savedVote.getVoteId());
        voteResponseDTO.setTitle(savedVote.getTitle());
        voteResponseDTO.setDescription(savedVote.getDescription());
        voteResponseDTO.setStatus(savedVote.getStatus());
        voteResponseDTO.setExpiresAt(savedVote.getExpiresAt());
        voteResponseDTO.setCreatedAt(savedVote.getCreatedAt());
        voteResponseDTO.setCreatedBy(savedVote.getCreatedBy().getUserId());
        voteResponseDTO.setOptions(optionResponseDTOList);
        return voteResponseDTO;
    }

    @Override
    public VoteResponseDTO GetVoteById(UUID voteId) {
        Vote savedVote = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found with id: " + voteId));
        VoteResponseDTO voteResponseDTO = new VoteResponseDTO();
        voteResponseDTO.setVoteId(savedVote.getVoteId());
        voteResponseDTO.setTitle(savedVote.getTitle());
        voteResponseDTO.setDescription(savedVote.getDescription());
        voteResponseDTO.setExpiresAt(savedVote.getExpiresAt());
        voteResponseDTO.setCreatedAt(savedVote.getCreatedAt());
        voteResponseDTO.setCreatedBy(savedVote.getCreatedBy().getUserId());
        return voteResponseDTO;
    }

    @Override
    public Page<VoteOnlyResponseDTO> GetAllVotes(int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Vote> votePage = voteRepository.findAllByStatus("Active", pageable);
        return votePage.map(vote -> {
            VoteOnlyResponseDTO voteOnlyResponseDTO = new VoteOnlyResponseDTO();
            voteOnlyResponseDTO.setVoteId(vote.getVoteId());
            voteOnlyResponseDTO.setTitle(vote.getTitle());
            voteOnlyResponseDTO.setDescription(vote.getDescription());
            voteOnlyResponseDTO.setStatus(vote.getStatus());
            voteOnlyResponseDTO.setCreatedBy(vote.getCreatedBy().getUserId());
            voteOnlyResponseDTO.setCreatedAt(vote.getCreatedAt());
            voteOnlyResponseDTO.setExpiresAt(vote.getExpiresAt());
            return voteOnlyResponseDTO;
        });
    }

    @Override
    public VoteOnlyResponseDTO UpdateVote(UUID voteId, VoteDetailRequestDTO voteDetailRequestDto) {
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResponseStatusException( HttpStatus.NOT_FOUND,"Vote not found with id: " + voteId));
        vote.setTitle(voteDetailRequestDto.getTitle());
        vote.setDescription(voteDetailRequestDto.getDescription());
        vote.setExpiresAt(voteDetailRequestDto.getExpiresAt());
        voteRepository.save(vote);
        return new VoteOnlyResponseDTO(vote.getVoteId(), vote.getTitle(), vote.getDescription(), vote.getStatus(), vote.getCreatedBy().getUserId(), vote.getCreatedAt(), vote.getExpiresAt());
    }

    @Override
    public void DeleteVote(UUID voteId) {
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResponseStatusException( HttpStatus.NOT_FOUND,"Vote not found with id: " + voteId));
        vote.setStatus("deleted");
        voteRepository.save(vote);
    }
}
