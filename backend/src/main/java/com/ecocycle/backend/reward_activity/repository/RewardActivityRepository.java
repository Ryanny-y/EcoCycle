package com.ecocycle.backend.reward_activity.repository;

import com.ecocycle.backend.dashboard.dto.response.MonthlyCollectionResponse;
import com.ecocycle.backend.dashboard.dto.response.WeeklyCollectionResponse;
import com.ecocycle.backend.reward_activity.dto.response.MaterialsCollectionResponse;
import com.ecocycle.backend.reward_activity.model.RewardActivity;
import com.ecocycle.backend.reward_activity.model.RewardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface RewardActivityRepository extends JpaRepository<RewardActivity, UUID> {

    @Query("""
                SELECT COALESCE(SUM(r.points), 0)
                FROM RewardActivity r
                WHERE r.type = :type
            """)
    BigDecimal getTotalPointsByType(@Param("type") RewardType type);


    Long countByType(RewardType type);


    @Query(value = """
                SELECT COALESCE(SUM(r.points), 0)
                FROM reward_activities r
                WHERE r.type = 'EARN'
                AND r.created_at >= date_trunc('month', CURRENT_DATE)
                AND r.created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
            """, nativeQuery = true)
    BigDecimal getPointsEarnedThisMonth();


    @Query(value = """
                SELECT COUNT(*)
                FROM reward_activities r
                WHERE r.type = 'REDEEM'
                AND r.created_at >= date_trunc('month', CURRENT_DATE)
                AND r.created_at < date_trunc('month', CURRENT_DATE) + interval '1 month'
            """, nativeQuery = true)
    Long countRedeemedThisMonth();


    @Query("""
                SELECT new com.ecocycle.backend.dashboard.dto.response.MonthlyCollectionResponse(
                    CONCAT('Month ', FUNCTION('DATE_PART', 'month', r.createdAt)),
                    COALESCE(SUM(r.points), 0)
                )
                FROM RewardActivity r
                WHERE r.type = :rewardType
                GROUP BY FUNCTION('DATE_PART', 'month', r.createdAt)
                ORDER BY FUNCTION('DATE_PART', 'month', r.createdAt)
            """)
    List<MonthlyCollectionResponse> getMonthlyCollections(@Param("rewardType") RewardType rewardType);

    @Query("""
                SELECT new com.ecocycle.backend.dashboard.dto.response.WeeklyCollectionResponse(
                    CONCAT('Week ', FUNCTION('DATE_PART', 'week', r.createdAt)),
                    COALESCE(SUM(r.points), 0)
                )
                FROM RewardActivity r
                WHERE r.type = :rewardType
                GROUP BY FUNCTION('DATE_PART', 'week', r.createdAt)
                ORDER BY FUNCTION('DATE_PART', 'week', r.createdAt)
            """)
    List<WeeklyCollectionResponse> getWeeklyCollections(@Param("rewardType") RewardType rewardType);

    @Query("""
                SELECT r
                FROM RewardActivity r
                WHERE r.createdAt >= :startDate
            """)
    List<RewardActivity> findAllFromDate(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT new com.ecocycle.backend.reward_activity.dto.response.MaterialsCollectionResponse(
            m.name,
            SUM(ram.weight)
        )
        FROM RewardActivityMaterial ram
        JOIN ram.activity ra
        JOIN ram.material m
        WHERE ra.type = 'EARN'
        GROUP BY m.name
        ORDER BY SUM(ram.weight) DESC
    """)
    List<MaterialsCollectionResponse> getMaterialsCollection();
}
