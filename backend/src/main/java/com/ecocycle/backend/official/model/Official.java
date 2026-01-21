package com.ecocycle.backend.official.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "officials")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Official {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, unique = true)
    private String fullName;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OfficialPosition position;

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_att")
    private LocalDateTime updatedAt;
}
