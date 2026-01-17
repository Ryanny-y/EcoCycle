package com.ecocycle.backend.farm.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

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

    @Column(nullable = false)
    private String name;

    @Embedded
    private Location location;

    @Embedded
    private FarmSize size;

    @Column(name = "established_at", nullable = false)
    private LocalDate establishedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "farm_type")
    private FarmType farmType;

    @Column(nullable = false)
    private String address;

    @Column(length = 2000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
