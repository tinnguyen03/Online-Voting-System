package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.Option.OptionRequestDTO;
import com.development.OnlineVoting.dtos.Option.OptionResponseDTO;
import com.development.OnlineVoting.entities.Option;
import com.development.OnlineVoting.entities.Vote;
import com.development.OnlineVoting.repositories.OptionRepository;
import com.development.OnlineVoting.repositories.VoteRepository;
import com.development.OnlineVoting.services.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class OptionServiceImpl implements OptionService {
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private OptionRepository optionRepository;
    @Override
    public OptionResponseDTO CreateOption(OptionRequestDTO optionRequestDTO) {
        Vote vote = voteRepository.findById(optionRequestDTO.getVoteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ("Vote not found with id: " + optionRequestDTO.getVoteId()));
        Option option = new Option();
        option.setVote(vote);
        option.setContent(optionRequestDTO.getContent());
        Option savedOption = optionRepository.save(option);
        return new OptionResponseDTO(savedOption.getOptionId(), savedOption.getContent(), savedOption.getVotesCount());
    }

    @Override
    public OptionResponseDTO GetOptionById(UUID optionId) {
        Option option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ("Option not found with id: " + optionId)));
        return new OptionResponseDTO(option.getOptionId(), option.getContent(), option.getVotesCount());
    }

    @Override
    public List<OptionResponseDTO> GetAllOptions(UUID voteId) {
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found with id: " + voteId));
        List<Option> options = optionRepository.findAllByVote(vote);
        return options.stream().map(option -> new OptionResponseDTO(option.getOptionId(), option.getContent(), option.getVotesCount())).toList();
    }

    @Override
    public void DeleteOption(UUID optionId) {
        optionRepository.deleteById(optionId);
    }
}
