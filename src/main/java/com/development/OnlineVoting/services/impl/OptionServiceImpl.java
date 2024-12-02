package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.Option.OptionRequestDTO;
import com.development.OnlineVoting.dtos.Option.OptionResponseDTO;
import com.development.OnlineVoting.services.OptionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OptionServiceImpl implements OptionService {
    @Override
    public OptionResponseDTO CreateOption(OptionRequestDTO optionRequestDTO) {
        return null;
    }

    @Override
    public OptionResponseDTO GetOptionById(UUID optionId) {
        return null;
    }

    @Override
    public List<OptionResponseDTO> GetAllOptions(UUID voteId) {
        return null;
    }

    @Override
    public void DeleteOption(UUID optionId) {

    }
}
