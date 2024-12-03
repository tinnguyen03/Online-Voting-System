package com.development.OnlineVoting.services.impl;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.development.OnlineVoting.dtos.Auth.AuthRequestDto;
import com.development.OnlineVoting.dtos.Auth.AuthResponseDto;
import com.development.OnlineVoting.dtos.Auth.TokenDto;
import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import com.development.OnlineVoting.entities.User;
import com.development.OnlineVoting.repositories.UserRepository;
import com.development.OnlineVoting.security.JwtTokenProvider;
import com.development.OnlineVoting.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserServiceImpl(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    @Override
    public AuthResponseDto login(AuthRequestDto authRequestDto) {
        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequestDto.getEmail(),
                            authRequestDto.getPassword()
                    )
            );
            User user = userRepository.findByEmail(authRequestDto.getEmail());
            if (user == null) {
                throw new BadCredentialsException("Invalid email or password");
            }
            UserResponseDTO userResponseDTO = new UserResponseDTO();
            userResponseDTO.setUserId(user.getUserId());
            userResponseDTO.setName(user.getName());
            userResponseDTO.setEmail(user.getEmail());
            userResponseDTO.setRole(user.getRole());
            userResponseDTO.setStatus(user.getStatus());
            userResponseDTO.setBannedReason(user.getBannedReason());
            userResponseDTO.setCreatedAt(user.getCreatedAt());

            String token = jwtTokenProvider.generateToken(authentication);

            return new AuthResponseDto(userResponseDTO, new TokenDto(token));

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password", e);
        }
    }




    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPasswordHash(BCrypt.withDefaults().hashToString(12, userRequestDTO.getPassword().toCharArray()));
        userRepository.save(user);
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setUserId(user.getUserId());
        userResponseDTO.setName(user.getName());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setRole(user.getRole());
        userResponseDTO.setStatus(user.getStatus());
        userResponseDTO.setBannedReason(user.getBannedReason());
        userResponseDTO.setCreatedAt(user.getCreatedAt());
        return userResponseDTO;
    }

    @Override
    public UserResponseDTO getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setUserId(user.getUserId());
        userResponseDTO.setName(user.getName());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setRole(user.getRole());
        userResponseDTO.setStatus(user.getStatus());
        userResponseDTO.setBannedReason(user.getBannedReason());
        userResponseDTO.setCreatedAt(user.getCreatedAt());
        return userResponseDTO;
    }

    @Override
    public Page<UserResponseDTO> getAllUsers(int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<User> userPage = userRepository.findAll(pageable);

        return userPage.map(user -> {
            UserResponseDTO userResponseDTO = new UserResponseDTO();
            userResponseDTO.setUserId(user.getUserId());
            userResponseDTO.setName(user.getName());
            userResponseDTO.setEmail(user.getEmail());
            userResponseDTO.setRole(user.getRole());
            userResponseDTO.setStatus(user.getStatus());
            userResponseDTO.setBannedReason(user.getBannedReason());
            userResponseDTO.setCreatedAt(user.getCreatedAt());
            return userResponseDTO;
        });
    }

    @Override
    public UserResponseDTO updateUser(UUID userId, UserRequestDTO userRequestDTO) {
        return null;
    }

    @Override
    public void deleteUser(UUID userId, String banned_reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus("Banned");
        user.setBannedReason(banned_reason);
        userRepository.save(user);
    }
}
