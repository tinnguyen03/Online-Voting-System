package com.development.OnlineVoting.controller;

import com.development.OnlineVoting.dtos.UserVote.UserVoteRequestDTO;
import com.development.OnlineVoting.dtos.UserVote.UserVoteResponseDTO;
import com.development.OnlineVoting.services.UserVoteService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @DeleteMapping("/revoke/{userId}/{voteId}")
    public ResponseEntity<Void> DeleteUserVote(@PathVariable UUID userId, @PathVariable UUID voteId) {
        userVoteService.DeleteUserVote(userId, voteId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/isVoted/{userId}/{voteId}")
    public ResponseEntity<Boolean> IsUserVoted(@PathVariable UUID userId, @PathVariable UUID voteId) {
        return ResponseEntity.ok(userVoteService.isUserVoted(userId, voteId));
    }

    @GetMapping("/find/{userId}/{voteId}")
    public ResponseEntity<UserVoteResponseDTO> FindUserVote(@PathVariable UUID userId, @PathVariable UUID voteId){
        return ResponseEntity.ok(userVoteService.FindVoteOption(userId, voteId));
    }
}
