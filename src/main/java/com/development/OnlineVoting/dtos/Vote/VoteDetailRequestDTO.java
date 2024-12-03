package com.development.OnlineVoting.dtos.Vote;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class VoteDetailRequestDTO {
    private String title;
    private String description;
    private Date expiresAt;
}
