package com.ecocycle.backend.farm.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "farms")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 2000)
    private String description;

    @Embedded
    private Location location;

    @Embedded
    private FarmSize size;

    @Column(name = "established_at")
    private LocalDate establishedAt;

    @ElementCollection(fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "farm_types", joinColumns = @JoinColumn(name = "farm_id"))
    @Column(name = "farm_type")
    @Builder.Default
    private List<FarmType> farmTypes = new ArrayList<>();

    @Column(nullable = false)
    private String address;

    @Column(name = "image_url")
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
