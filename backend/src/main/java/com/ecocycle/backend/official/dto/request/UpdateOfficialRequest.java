package com.ecocycle.backend.official.dto.request;

import com.ecocycle.backend.official.model.OfficialPosition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateOfficialRequest {
    private String fullName;
    private OfficialPosition position;
    private String biography;
    private MultipartFile image;
}