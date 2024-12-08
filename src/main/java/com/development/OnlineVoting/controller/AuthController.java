package com.development.OnlineVoting.controller;


import com.development.OnlineVoting.dtos.Auth.AuthRequestDto;
import com.development.OnlineVoting.dtos.Auth.AuthResponseDto;
import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import com.development.OnlineVoting.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    private ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto authRequestDto) {
        return ResponseEntity.ok(userService.login(authRequestDto));
    }

    @PostMapping("/register")
    private ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO userRequestDto) {
        return new ResponseEntity<>(userService.createUser(userRequestDto), HttpStatus.CREATED);
    }

}
