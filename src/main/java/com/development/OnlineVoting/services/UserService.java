package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.Auth.AuthRequestDto;
import com.development.OnlineVoting.dtos.Auth.AuthResponseDto;
import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {

    AuthResponseDto login(AuthRequestDto authRequestDto);
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);
    UserResponseDTO getUserById(UUID userId);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO updateUser(UUID userId, UserRequestDTO userRequestDTO);
    void deleteUser(UUID userId);

}
