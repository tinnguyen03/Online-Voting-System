package com.development.OnlineVoting.dtos.UserVote;

import lombok.*;

import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserVoteRequestDTO {
    private UUID userId;
    private UUID voteId;
    private UUID optionId;
}
