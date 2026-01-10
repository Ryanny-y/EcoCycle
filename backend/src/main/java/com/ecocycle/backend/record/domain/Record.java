package com.ecocycle.backend.record.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "resident_records")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, unique = true)
    private UUID id;

    @Column(length = 10, nullable = false, unique = true)
    private String code;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "middle_name", nullable = false)
    private String middleName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(length = 10)
    private String suffix;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private Boolean isResident;

    private String address;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal points = BigDecimal.ONE;

    @Column(length = 11, name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Record that = (Record) o;
        return Objects.equals(id, that.id) && Objects.equals(code, that.code) && Objects.equals(firstName, that.firstName) && Objects.equals(lastName, that.lastName) && Objects.equals(middleName, that.middleName) && Objects.equals(suffix, that.suffix) && Objects.equals(birthDate, that.birthDate) && gender == that.gender && Objects.equals(isResident, that.isResident) && Objects.equals(address, that.address) && Objects.equals(points, that.points) && Objects.equals(contactNumber, that.contactNumber) && Objects.equals(createdAt, that.createdAt) && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, firstName, lastName, middleName, suffix, birthDate, gender, isResident, address, points, contactNumber, createdAt, updatedAt);
    }
}
