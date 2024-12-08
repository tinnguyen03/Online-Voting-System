package com.development.OnlineVoting.services.impl;

import com.development.OnlineVoting.dtos.User.CustomUserDetails;
import com.development.OnlineVoting.entities.User;
import com.development.OnlineVoting.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Email not found");
        }
        return new CustomUserDetails(user);
    }
}
