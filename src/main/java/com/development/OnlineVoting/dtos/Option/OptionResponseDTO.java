package com.development.OnlineVoting.dtos.Option;

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
}
