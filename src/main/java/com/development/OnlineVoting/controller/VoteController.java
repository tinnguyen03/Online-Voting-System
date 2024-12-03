package com.development.OnlineVoting.controller;

import com.development.OnlineVoting.dtos.Vote.VoteDetailRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteOnlyResponseDTO;
import com.development.OnlineVoting.dtos.Vote.VoteRequestDTO;
import com.development.OnlineVoting.dtos.Vote.VoteResponseDTO;
import com.development.OnlineVoting.services.VoteService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/vote")
public class VoteController {
    @Autowired
    private VoteService voteService;

    @PostMapping
    public ResponseEntity<VoteResponseDTO> CreateVote(@RequestBody VoteRequestDTO voteRequestDTO) {
        return ResponseEntity.ok(voteService.CreateVote(voteRequestDTO));
    }

    @GetMapping("{voteId}")
    public ResponseEntity<VoteResponseDTO> GetVoteById(@PathVariable UUID voteId) {
        return ResponseEntity.ok(voteService.GetVoteById(voteId));
    }

    @GetMapping
    public ResponseEntity<Page<VoteOnlyResponseDTO>> GetAllVotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(voteService.GetAllVotes(page, limit));
    }

    @PutMapping("{voteId}")
    public ResponseEntity<VoteOnlyResponseDTO> UpdateVote(@PathVariable UUID voteId,@RequestBody VoteDetailRequestDTO voteRequestDTO) {
        return ResponseEntity.ok(voteService.UpdateVote(voteId, voteRequestDTO));
    }

    @DeleteMapping("{voteId}")
    public ResponseEntity<Void> DeleteVote(@PathVariable UUID voteId) {
        voteService.DeleteVote(voteId);
        return ResponseEntity.ok().build();
    }
}
