package com.ecocycle.backend.reward_activity.model;

import com.ecocycle.backend.record.model.Record;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reward_activities")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RewardActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private Record record;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal points;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RewardType type;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "activity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<RewardActivityMaterial> materials = new ArrayList<>();
}