package com.development.OnlineVoting.dtos.Option;

import com.development.OnlineVoting.entities.Option;
import com.development.OnlineVoting.entities.Vote;
import lombok.*;

import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OptionResponseDTO {
    private UUID optionId;
    private String content;
    private Integer votesCount;

//    public OptionResponseDTO toDto(Option option) {
//        return OptionResponseDTO.builder()
//                .optionId(option.getOptionId())
//                .content(option.getContent())
//                .votesCount(option.getVotesCount())
//                .build();
//    }
}
