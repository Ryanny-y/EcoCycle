package com.ecocycle.backend.farm.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class FarmSize {

    private Double value;

    @Enumerated(EnumType.STRING)
    private SizeUnit unit;
}
