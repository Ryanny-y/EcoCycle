package com.ecocycle.backend.official;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.official.dto.OfficialDto;
import com.ecocycle.backend.official.dto.request.CreateOfficialRequest;
import com.ecocycle.backend.official.dto.request.UpdateOfficialRequest;
import com.ecocycle.backend.official.model.Official;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/officials")
@RequiredArgsConstructor
public class OfficialController {

    private final OfficialService officialService;
    private final OfficialMapper officialMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OfficialDto>>> getOfficials() {
        List<Official> officials = officialService.getOfficials();

        List<OfficialDto> officialDtos = officials.stream()
                .map(officialMapper::toDto)
                .toList();

        ApiResponse<List<OfficialDto>> apiResponse = ApiResponse.<List<OfficialDto>>builder()
                .success(true)
                .message("Officials retrieved")
                .data(officialDtos)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OfficialDto>> getOfficial(
            @PathVariable("id") UUID id
    ) {
        Official official = officialService.getOfficialById(id);

        ApiResponse<OfficialDto> apiResponse = ApiResponse.<OfficialDto>builder()
                .success(true)
                .message("Official retrieved")
                .data(officialMapper.toDto(official))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OfficialDto>> createOfficial(
            @Valid @ModelAttribute CreateOfficialRequest request
    ) {
        Official createdOfficial = officialService.createOfficial(request);

        ApiResponse<OfficialDto> apiResponse = ApiResponse.<OfficialDto>builder()
                .success(true)
                .message("Official '" + createdOfficial.getFullName() + "' added successfully!")
                .data(officialMapper.toDto(createdOfficial))
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<OfficialDto>> updateOfficial(
            @PathVariable("id") UUID id,
            @Valid @ModelAttribute UpdateOfficialRequest request
    ) {
        Official updatedOfficial = officialService.updateOfficial(id, request);

        ApiResponse<OfficialDto> apiResponse = ApiResponse.<OfficialDto>builder()
                .success(true)
                .message("Official '" + updatedOfficial.getFullName() + "' updated successfully!")
                .data(officialMapper.toDto(updatedOfficial))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOfficial(
            @PathVariable("id") UUID id
    ) {
        Official deletedOfficial = officialService.deleteOfficial(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Official '" + deletedOfficial.getFullName() + "' deleted successfully!")
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}