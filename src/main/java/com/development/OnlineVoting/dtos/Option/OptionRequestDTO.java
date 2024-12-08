package com.development.OnlineVoting.dtos.Option;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionRequestDTO {
    private UUID voteId;
    private String content;
}