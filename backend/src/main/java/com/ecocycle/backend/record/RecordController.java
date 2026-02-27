package com.ecocycle.backend.record;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.common.web.PageResponse;
import com.ecocycle.backend.record.dto.RecordDto;
import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.dto.response.LookupResponse;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.dto.response.CreateRecordResponse;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;
    private final RecordMapper recordMapper;

    @RateLimit(limit = 120, duration = 1)
    @GetMapping
    public ResponseEntity<PageResponse<RecordDto>> getRecords(
            @RequestParam(required = false) Boolean isResident,
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        Page<Record> pageRecords = recordService.getRecords(isResident, search, pageable);
        List<RecordDto> pageContent = pageRecords.getContent().stream().map(recordMapper::toDto).toList();

        PageResponse<RecordDto> apiResponse = PageResponse.<RecordDto>builder()
                .content(pageContent)
                .page(pageRecords.getNumber())
                .size(pageRecords.getSize())
                .totalElements(pageRecords.getTotalElements())
                .totalPages(pageRecords.getTotalPages())
                .first(pageRecords.isFirst())
                .last(pageRecords.isLast())
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
    @PostMapping
    public ResponseEntity<ApiResponse<CreateRecordResponse>> createRecord(
            @Valid @RequestBody CreateRecordRequest request
    ) {
        Record createdRecord = recordService.createRecord(request);
        CreateRecordResponse createResponse = new CreateRecordResponse(
                createdRecord.getFirstName(),
                createdRecord.getMiddleName(),
                createdRecord.getLastName()
        );

        ApiResponse<CreateRecordResponse> apiResponse = ApiResponse.<CreateRecordResponse>builder()
                .success(true)
                .message(createdRecord.getLastName() + " Created")
                .data(createResponse)
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @RateLimit(limit = 10, duration = 1)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecordDto>> updateRecord(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateRecordRequest updateRecordRequest
    ) {
        Record updatedRecord = recordService.updateRecord(id, updateRecordRequest);
        RecordDto updatedRecordDto = recordMapper.toDto(updatedRecord);

        ApiResponse<RecordDto> apiResponse = ApiResponse.<RecordDto>builder()
                .success(true)
                .message("Record updated successfully.")
                .data(updatedRecordDto)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(@PathVariable("id") UUID id) {
        Record deletedRecord = recordService.deleteRecord(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Record: " + deletedRecord.getLastName() + " deleted successfully.")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 60, duration = 1)
    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<LookupResponse>> lookupRecord(
            @RequestParam("lastName") String lastName,
            @RequestParam(value = "firstName", required = false) String firstName
    ) {
        Record record = recordService.lookupRecord(lastName, firstName);

        ApiResponse<LookupResponse> apiResponse = ApiResponse.<LookupResponse>builder()
                .success(true)
                .message("Record found.")
                .data(new LookupResponse(record.getPoints(), record.getLastName()))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

//    Export Records
    @GetMapping(value = "/export", produces = "text/csv; charset=UTF-8")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportRecords(
            @RequestParam("isResident") Boolean isResident
    ) throws IOException {

        String csv = recordService.downloadRecords(isResident);
        String fileName = isResident
                ? "resident_records.csv"
                : "non_resident_records.csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

}
