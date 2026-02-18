package com.ecocycle.backend.reward.repository;

import com.ecocycle.backend.dashboard.dto.response.TopMaterialResponse;
import com.ecocycle.backend.reward.model.RewardActivityMaterial;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface RewardActivityMaterialRepository
        extends JpaRepository<RewardActivityMaterial, UUID> {

    @Query("""
        SELECT COALESCE(SUM(m.weight), 0)
        FROM RewardActivityMaterial m
        JOIN m.activity a
        WHERE a.type = com.ecocycle.backend.reward.model.RewardType.EARN
    """)
    BigDecimal getTotalCollectedWeight();

    @Query("""
        SELECT new com.ecocycle.backend.dashboard.dto.response.TopMaterialResponse(
            m.material.name,
            SUM(m.weight)
        )
        FROM RewardActivityMaterial m
        JOIN m.activity a
        WHERE a.type = com.ecocycle.backend.reward.model.RewardType.EARN
        GROUP BY m.material.name
        ORDER BY SUM(m.weight) DESC
    """)
    List<TopMaterialResponse> getTop5Materials(Pageable pageable);
}
