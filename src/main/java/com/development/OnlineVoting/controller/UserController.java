package com.development.OnlineVoting.controller;

import com.development.OnlineVoting.dtos.User.UserRequestDTO;
import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import com.development.OnlineVoting.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(userService.getAllUsers(page, limit));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable UUID userId,@RequestBody UserRequestDTO userRequestDTO) {
        return ResponseEntity.ok(userService.updateUser(userId, userRequestDTO));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId, @RequestParam String banned_reason) {
        userService.deleteUser(userId, banned_reason);
        return ResponseEntity.ok().build();
    }
}
