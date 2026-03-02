package com.ecocycle.backend.record.dto.request;

import com.ecocycle.backend.record.model.Gender;
import com.ecocycle.backend.record.model.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRecordRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name is too long")
    private String firstName;

    @Size(max = 100, message = "Middle name is too long")
    private String middleName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name is too long")
    private String lastName;

    @Size(max = 10, message = "Suffix must not exceed 10 characters")
    private String suffix;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Resident status is required")
    private Boolean isResident;

    @NotNull(message = "Role is required")
    private Role role;

    @Pattern(
            regexp = "^$|^\\d{11}$",
            message = "Contact number must be exactly 11 digits"
    )
    private String contactNumber;

    @NotNull(message = "Area is required")
    @Min(1)
    @Max(7)
    private Integer area;

    @NotBlank(message = "Subdivision is required.")
    private String subdivision;
}
