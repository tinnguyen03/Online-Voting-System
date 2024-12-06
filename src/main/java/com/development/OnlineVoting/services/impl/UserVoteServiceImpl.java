package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;
import com.development.OnlineVoting.entities.Option;
import com.development.OnlineVoting.entities.UserVote;
import com.development.OnlineVoting.entities.Vote;
import com.development.OnlineVoting.repositories.OptionRepository;
import com.development.OnlineVoting.repositories.UserRepository;
import com.development.OnlineVoting.repositories.UserVoteRepository;
import com.development.OnlineVoting.repositories.VoteRepository;
import com.development.OnlineVoting.services.UserVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
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
    public UserVoteResponseDTO castVote(UserVoteRequestDTO userVoteRequestDTO) {
        UserVote userVoted = userVoteRepository.findByUser_UserIdAndVote_VoteIdAndOption_OptionId(userVoteRequestDTO.getUserId(), userVoteRequestDTO.getVoteId(), userVoteRequestDTO.getOptionId());
        if (userVoted != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vote already casted");
        }
        Vote vote = voteRepository.findById(userVoteRequestDTO.getVoteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found"));
        if (vote.getExpiresAt().before(new Date())) {
            if (!"expired".equals(vote.getStatus())) {
                vote.setStatus("expired");
                voteRepository.save(vote);
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vote has expired");
        }

        var user = userRepository.findById(userVoteRequestDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Option option = optionRepository.findById(userVoteRequestDTO.getOptionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Option not found"));

        synchronized (this) {
            option.setVotesCount(option.getVotesCount() + 1);
            optionRepository.save(option);
        }

        UserVote userVote = UserVote.builder()
                .vote(vote)
                .user(user)
                .option(option)
                .votedAt(new Date())
                .build();
        UserVote savedUserVote = userVoteRepository.save(userVote);

        return new UserVoteResponseDTO(savedUserVote.getUserVoteId(),
                savedUserVote.getVote().getVoteId(),
                savedUserVote.getUser().getUserId(),
                savedUserVote.getOption().getOptionId(),
                savedUserVote.getVotedAt());
    }

    @Override
    public void DeleteUserVote(UUID userId, UUID voteId) {
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found"));
        if (vote.getExpiresAt().before(new Date())) {
            if (!"expired".equals(vote.getStatus())) {
                vote.setStatus("expired");
                voteRepository.save(vote);
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vote has expired");
        }

        if (!vote.getStatus().equals("Active")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vote has ended");
        }

        UserVote userVote = userVoteRepository.findByUser_UserIdAndVote_VoteId(userId, voteId);
        if(userVote == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found");
        }

        userVoteRepository.deleteById(userVote.getUserVoteId());
        Option option = optionRepository.findById(userVote.getOption().getOptionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Option not found"));
        option.setVotesCount(option.getVotesCount() - 1);
        optionRepository.save(option);
    }

    @Override
    public UserVoteResponseDTO FindVoteOption(UUID userId, UUID voteId) {
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vote not found"));
        if (vote.getExpiresAt().before(new Date())) {
            if (!"expired".equals(vote.getStatus())) {
                vote.setStatus("expired");
                voteRepository.save(vote);
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vote has expired");
        }
        UserVote userVote = userVoteRepository.findByUser_UserIdAndVote_VoteId(userId, voteId);
        if (userVote == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User vote not found");
        }
        return new UserVoteResponseDTO(
                userVote.getUserVoteId(),
                userVote.getUser().getUserId(),
                userVote.getVote().getVoteId(),
                userVote.getOption().getOptionId(),
                userVote.getVotedAt()
        );
    }

    @Override
    public boolean isUserVoted(UUID userId, UUID voteId) {
        return userVoteRepository.findByUser_UserIdAndVote_VoteId(userId, voteId) != null;
    }
}
