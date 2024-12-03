package com.development.OnlineVoting.repositories;

import com.development.OnlineVoting.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByEmail(String email);
    Page<User> findAll(Pageable pageable);
}
