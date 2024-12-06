package com.development.OnlineVoting.controller;

import com.development.OnlineVoting.dtos.Option.OptionRequestDTO;
import com.development.OnlineVoting.dtos.Option.OptionResponseDTO;
import com.development.OnlineVoting.services.OptionService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/option")
public class OptionController {
    @Autowired
    private OptionService optionService;

    @PostMapping
    public ResponseEntity<OptionResponseDTO> CreateOption(@RequestBody OptionRequestDTO optionRequestDTO) {
        return ResponseEntity.ok(optionService.CreateOption(optionRequestDTO));
    }

    @GetMapping("/{optionId}")
    public ResponseEntity<OptionResponseDTO> GetOptionById(@PathVariable UUID optionId) {
        return ResponseEntity.ok(optionService.GetOptionById(optionId));
    }

    @GetMapping("{voteId}")
    public ResponseEntity<List<OptionResponseDTO>> GetAllOptions(@PathVariable UUID voteId) {
        return ResponseEntity.ok(optionService.GetAllOptions(voteId));
    }

    @DeleteMapping("/{optionId}")
    public ResponseEntity<Void> DeleteOption(@PathVariable UUID optionId) {
        optionService.DeleteOption(optionId);
        return ResponseEntity.ok().build();
    }
}
