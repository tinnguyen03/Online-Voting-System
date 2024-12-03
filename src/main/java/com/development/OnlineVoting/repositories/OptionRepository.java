package com.development.OnlineVoting.repositories;

import com.development.OnlineVoting.entities.Option;
import com.development.OnlineVoting.entities.Vote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OptionRepository extends JpaRepository<Option, UUID> {

    List<Option> findAllByVote(Vote vote);

}
