package com.development.OnlineVoting.dtos.Vote;

import com.development.OnlineVoting.dtos.Option.OptionCreateDTO;
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
public class VoteRequestDTO {
    private String title;
    private String description;
    private Date expiresAt;
    private UUID createdBy;
    List<OptionCreateDTO> options;
}
