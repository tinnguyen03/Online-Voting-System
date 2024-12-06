package com.development.OnlineVoting.repositories;

import com.development.OnlineVoting.entities.Vote;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VoteRepository extends JpaRepository<Vote, UUID> {
    @NotNull Page<Vote> findAll(@NotNull Pageable pageable);
    Page<Vote> findAllByStatus(String status, Pageable pageable);
}
