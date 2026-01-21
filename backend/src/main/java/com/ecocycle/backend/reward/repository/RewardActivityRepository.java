package com.ecocycle.backend.reward.repository;

import com.ecocycle.backend.reward.model.RewardActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RewardActivityRepository extends JpaRepository<RewardActivity, UUID> {
}