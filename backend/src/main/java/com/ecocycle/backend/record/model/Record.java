package com.ecocycle.backend.record.model;

import com.ecocycle.backend.reward.model.RewardActivity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
    private BigDecimal points = BigDecimal.ZERO;

    @Column(length = 11, name = "contact_number", nullable = false)
    private String contactNumber;

    @Version
    private Long version;

//    RELATIONSHIPS
    @OneToMany(mappedBy = "record", fetch = FetchType.LAZY)
    private List<RewardActivity> rewardActivities;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Record that = (Record) o;
        return Objects.equals(id, that.id) && Objects.equals(firstName, that.firstName) && Objects.equals(lastName, that.lastName) && Objects.equals(middleName, that.middleName) && Objects.equals(suffix, that.suffix) && Objects.equals(birthDate, that.birthDate) && gender == that.gender && Objects.equals(isResident, that.isResident) && Objects.equals(address, that.address) && Objects.equals(points, that.points) && Objects.equals(contactNumber, that.contactNumber) && Objects.equals(createdAt, that.createdAt) && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, middleName, suffix, birthDate, gender, isResident, address, points, contactNumber, createdAt, updatedAt);
    }
}
