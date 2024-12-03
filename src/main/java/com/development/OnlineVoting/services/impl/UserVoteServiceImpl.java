package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;
import com.development.OnlineVoting.entities.Option;
import com.development.OnlineVoting.entities.UserVote;
import com.development.OnlineVoting.entities.Vote;
import com.development.OnlineVoting.repositories.OptionRepository;
import com.development.OnlineVoting.repositories.UserRepository;
import com.development.OnlineVoting.repositories.UserVoteRepository;
import com.development.OnlineVoting.repositories.VoteRepository;
import com.development.OnlineVoting.services.UserService;
import com.development.OnlineVoting.services.UserVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserVoteServiceImpl implements UserVoteService {
    @Autowired
    private UserVoteRepository userVoteRepository;
    @Autowired
    private VoteRepository voteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OptionRepository optionRepository;

    @Override
    public UserVoteResponseDTO UserVote(UserVoteRequestDTO userVoteRequestDTO) {
        UserVote userVote = new UserVote();
        Vote vote = voteRepository.findById(userVoteRequestDTO.getVoteId())
                .orElseThrow(() -> new RuntimeException("Vote not found with id: " + userVoteRequestDTO.getVoteId()));
        if(vote.getExpiresAt().toInstant().isBefore(new Date().toInstant())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vote has expired");
        }
        userVote.setVote(vote);
        userVote.setUser(userRepository.findById(userVoteRequestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userVoteRequestDTO.getUserId())));
        Option option = optionRepository.findById(userVoteRequestDTO.getOptionId())
                .orElseThrow(() -> new RuntimeException("Option not found with id: " + userVoteRequestDTO.getOptionId()));
        option.setVotesCount(option.getVotesCount() + 1);
        optionRepository.save(option);

        userVote.setOption(option);
        UserVote savedUserVote = userVoteRepository.save(userVote);

        return new UserVoteResponseDTO(savedUserVote.getUserVoteId(), savedUserVote.getVote().getVoteId(), savedUserVote.getUser().getUserId(), savedUserVote.getOption().getOptionId(), savedUserVote.getVotedAt());
    }

    @Override
    public void DeleteUserVote(UserVoteRequestDTO userVoteRequestDTO) {
        UserVote userVote = userVoteRepository.findByUser_UserIdAndVote_VoteIdAndOption_OptionId(userVoteRequestDTO.getUserId(), userVoteRequestDTO.getVoteId(), userVoteRequestDTO.getOptionId());
        userVoteRepository.deleteById(userVote.getUserVoteId());
        Option option = optionRepository.findById(userVoteRequestDTO.getOptionId())
                .orElseThrow(() -> new RuntimeException("Option not found with id: " + userVoteRequestDTO.getOptionId()));
        option.setVotesCount(option.getVotesCount() - 1);
        optionRepository.save(option);
    }
}
