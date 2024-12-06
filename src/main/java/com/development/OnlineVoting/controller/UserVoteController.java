package com.development.OnlineVoting.controller;

import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;
import com.development.OnlineVoting.services.UserVoteService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/vote")
@CrossOrigin("*")
public class UserVoteController {

    @Autowired
    private UserVoteService userVoteService;

    @PostMapping("/vote")
    public ResponseEntity<UserVoteResponseDTO> UserVote(@RequestBody UserVoteRequestDTO userVoteRequestDTO) {
        return ResponseEntity.ok(userVoteService.castVote(userVoteRequestDTO));
    }

    @PostMapping("/revoke")
    public ResponseEntity<Void> DeleteUserVote(@RequestBody UserVoteRequestDTO userVoteRequestDTO) {
        userVoteService.DeleteUserVote(userVoteRequestDTO);
        return ResponseEntity.ok().build();
    }
}
