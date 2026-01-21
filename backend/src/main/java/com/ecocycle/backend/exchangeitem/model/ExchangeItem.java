package com.ecocycle.backend.exchangeitem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "exchange_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "item_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ItemType itemType;

    @Column(name = "main_category", nullable = false)
    @Enumerated(EnumType.STRING)
    private MainCategory mainCategory;

    @Column(name = "sub_category", nullable = false)
    private String subCategory;

    @Builder.Default
    private Integer stocks = 0;

    @Column(name = "required_points", nullable = false)
    @Builder.Default
    private Integer requiredPoints = 1;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Unit unit;

    @Column(name = "farm_origin")
    private String farmOrigin;

    @Column(name = "last_restocked")
    private LocalDateTime lastRestocked;

    @Column(name = "image_url")
    private String imageUrl;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
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
        ExchangeItem that = (ExchangeItem) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(description, that.description) && itemType == that.itemType && Objects.equals(mainCategory, that.mainCategory) && Objects.equals(subCategory, that.subCategory) && Objects.equals(stocks, that.stocks) && Objects.equals(requiredPoints, that.requiredPoints) && unit == that.unit && Objects.equals(farmOrigin, that.farmOrigin) && Objects.equals(lastRestocked, that.lastRestocked) && Objects.equals(imageUrl, that.imageUrl) && Objects.equals(createdAt, that.createdAt) && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, itemType, mainCategory, subCategory, stocks, requiredPoints, unit, farmOrigin, lastRestocked, imageUrl, createdAt, updatedAt);
    }
}
