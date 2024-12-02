package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;
import com.development.OnlineVoting.services.UserService;
import com.development.OnlineVoting.services.UserVoteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserVoteServiceImpl implements UserVoteService {

    @Override
    public UserVoteResponseDTO UserVote(UserVoteRequestDTO userVoteRequestDTO) {
        return null;
    }

    @Override
    public void DeleteUserVote(UserVoteRequestDTO userVoteRequestDTO) {

    }
}
