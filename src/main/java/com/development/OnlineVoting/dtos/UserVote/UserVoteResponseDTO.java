package com.development.OnlineVoting.dtos.UserVote;

import lombok.*;

import java.util.Date;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserVoteResponseDTO {
    private UUID userVoteId;
    private UUID userId;
    private UUID voteId;
    private UUID optionId;
    private Date votedAt;
}
