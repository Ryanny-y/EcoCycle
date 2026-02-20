package com.ecocycle.backend.reward.repository;

import com.ecocycle.backend.dashboard.dto.response.MonthlyCollectionResponse;
import com.ecocycle.backend.dashboard.dto.response.WeeklyCollectionResponse;
import com.ecocycle.backend.reward.model.RewardActivity;
import com.ecocycle.backend.reward.model.RewardType;
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
                WHERE r.type = com.ecocycle.backend.reward.model.RewardType.EARN
                GROUP BY FUNCTION('DATE_PART', 'month', r.createdAt)
                ORDER BY FUNCTION('DATE_PART', 'month', r.createdAt)
            """)
    List<MonthlyCollectionResponse> getMonthlyCollections();

    @Query("""
                SELECT new com.ecocycle.backend.dashboard.dto.response.WeeklyCollectionResponse(
                    CONCAT('Week ', FUNCTION('DATE_PART', 'week', r.createdAt)),
                    COALESCE(SUM(r.points), 0)
                )
                FROM RewardActivity r
                WHERE r.type = com.ecocycle.backend.reward.model.RewardType.EARN
                GROUP BY FUNCTION('DATE_PART', 'week', r.createdAt)
                ORDER BY FUNCTION('DATE_PART', 'week', r.createdAt)
            """)
    List<WeeklyCollectionResponse> getWeeklyCollections();

    @Query("""
                SELECT r
                FROM RewardActivity r
                WHERE r.createdAt >= :startDate
            """)
    List<RewardActivity> findAllFromDate(@Param("startDate") LocalDateTime startDate);
}
