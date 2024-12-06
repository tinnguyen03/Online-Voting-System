package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.Auth.AuthRequestDto;
import com.development.OnlineVoting.dtos.Auth.AuthResponseDto;
import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface UserService {

    AuthResponseDto login(AuthRequestDto authRequestDto);
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);
    UserResponseDTO getUserById(UUID userId);
    Page<UserResponseDTO> getAllUsers(int page, int limit);
    UserResponseDTO updateUser(UUID userId, UserRequestDTO userRequestDTO);
    void deleteUser(UUID userId, String banned_reason);
    UserResponseDTO getUserByEmail(String email);

}
