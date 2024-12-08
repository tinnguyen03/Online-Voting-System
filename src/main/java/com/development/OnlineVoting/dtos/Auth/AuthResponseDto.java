package com.development.OnlineVoting.dtos.Auth;

import com.development.OnlineVoting.dtos.User.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto{
    UserResponseDTO userResponseDTO;
    TokenDto tokenDto;
}
