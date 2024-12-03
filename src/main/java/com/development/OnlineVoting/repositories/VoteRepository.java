package com.development.OnlineVoting.repositories;

import com.development.OnlineVoting.entities.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VoteRepository extends JpaRepository<Vote, UUID> {
    Page<Vote> findAll(Pageable pageable);
}
