package com.development.OnlineVoting.dtos.Vote;

import com.development.OnlineVoting.dtos.Option.OptionResponseDTO;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class VoteResponseDTO {
    private UUID voteId;
    private String title;
    private String description;
    private String status;
    private UUID createdBy;
    private Date createdAt;
    private Date expiresAt;
    List<OptionResponseDTO> options;
}
