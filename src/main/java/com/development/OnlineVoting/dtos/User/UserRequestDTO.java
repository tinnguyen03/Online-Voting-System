package com.development.OnlineVoting.dtos.User;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserRequestDTO {
    private String name;
    private String email;
    private String password;
}