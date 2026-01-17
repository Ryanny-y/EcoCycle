package com.ecocycle.backend.farm.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FarmSize {

    @Column(nullable = false)
    private Double value;

    @Enumerated(EnumType.STRING)
    private SizeUnit unit;
}
