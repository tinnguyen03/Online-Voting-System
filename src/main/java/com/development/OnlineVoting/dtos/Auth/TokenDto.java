package com.development.OnlineVoting.dtos.Auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TokenDto {
    private String accessToken;
    private final String tokenType = "Bearer";
}
