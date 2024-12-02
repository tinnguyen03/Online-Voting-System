package com.development.OnlineVoting.dtos.User;

import lombok.*;

import java.util.Date;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserResponseDTO {
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private String status;
    private String bannedReason;
    private Date createdAt;
}
