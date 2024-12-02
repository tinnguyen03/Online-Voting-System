package com.development.OnlineVoting.repositories;

import com.development.OnlineVoting.entities.Option;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OptionRepository extends JpaRepository<Option, UUID> {
}
