package com.ecocycle.backend.material.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "materials")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer pointsPerKg = 1;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Material material = (Material) o;
        return Objects.equals(id, material.id) && Objects.equals(name, material.name) && Objects.equals(description, material.description) && Objects.equals(pointsPerKg, material.pointsPerKg) && Objects.equals(imageUrl, material.imageUrl) && Objects.equals(createdAt, material.createdAt) && Objects.equals(updatedAt, material.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, pointsPerKg, imageUrl, createdAt, updatedAt);
    }
}
