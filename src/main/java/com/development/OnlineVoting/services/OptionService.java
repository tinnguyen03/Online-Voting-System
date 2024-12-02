package com.development.OnlineVoting.services;

import com.development.OnlineVoting.dtos.Option.OptionRequestDTO;
import com.development.OnlineVoting.dtos.Option.OptionResponseDTO;

import java.util.List;
import java.util.UUID;

public interface OptionService {

    OptionResponseDTO CreateOption(OptionRequestDTO optionRequestDTO);

    OptionResponseDTO GetOptionById(UUID optionId);
    List<OptionResponseDTO> GetAllOptions(UUID voteId);
    void DeleteOption(UUID optionId);
}
