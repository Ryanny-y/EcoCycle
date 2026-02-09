package com.ecocycle.backend.record.dto;

import com.ecocycle.backend.record.model.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordDto {

    private UUID id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String suffix;
    private LocalDate birthDate;
    private Gender gender;
    private Boolean isResident;
    private String address;
    private BigDecimal points;
    private String contactNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
