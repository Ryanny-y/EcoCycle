package com.ecocycle.backend.reward.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "reward_activity_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardActivityMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private RewardActivity activity;

    @Column(name = "material_id", nullable = false)
    private UUID materialId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weight;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal points;
}