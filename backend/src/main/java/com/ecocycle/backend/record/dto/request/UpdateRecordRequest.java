package com.ecocycle.backend.record.dto.request;

import com.ecocycle.backend.record.model.Gender;
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

    @Size(max = 255, message = "Address is too long")
    private String address;

    @NotBlank(message = "Contact number is required")
    @Size(min = 11, max = 11, message = "Contact number must be exactly 11 digits")
    @Pattern(
            regexp = "^[0-9]+$",
            message = "Contact number must contain digits only"
    )
    private String contactNumber;
}
