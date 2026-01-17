package com.ecocycle.backend.farm.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {
    private Double latitude;
    private Double longitude;
}
