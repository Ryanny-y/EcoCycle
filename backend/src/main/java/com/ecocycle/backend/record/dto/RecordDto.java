package com.ecocycle.backend.record.dto;

import com.ecocycle.backend.record.model.Gender;
import com.ecocycle.backend.record.model.Role;
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
    private Role role;
    private BigDecimal points;
    private String contactNumber;
    private Integer area;
    private String subdivision;
    private LocalDateTime createdAt;

}
