package com.ecocycle.backend.record;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.common.web.PageResponse;
import com.ecocycle.backend.record.dto.RecordDto;
import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.dto.response.LookupResponse;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.dto.response.CreateRecordResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;
    private final RecordMapper recordMapper;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(@PathVariable("id") UUID id) {
        Record deletedRecord = recordService.deleteRecord(id);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Record: " + deletedRecord.getLastName() + " deleted successfully.")
                .build();

        return ResponseEntity.ok(apiResponse);
    }

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

}
