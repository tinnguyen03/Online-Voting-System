package com.development.OnlineVoting.dtos.Vote;

import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class VoteOnlyResponseDTO {
    private UUID voteId;
    private String title;
    private String description;
    private String status;
    private UUID createdBy;
    private Date createdAt;
    private Date expiresAt;
}
