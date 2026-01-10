package com.ecocycle.backend.record;

import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.record.domain.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.dto.response.CreateRecordResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    public ResponseEntity<ApiResponse<CreateRecordResponse>> createRecord(
            @Valid @RequestBody CreateRecordRequest request
    ) {
        Record createdRecord = recordService.createRecord(request);
        CreateRecordResponse createResponse = new CreateRecordResponse(
                createdRecord.getId(),
                createdRecord.getFirstName() + " " + createdRecord.getMiddleName().toUpperCase().charAt(0) + " " + createdRecord.getLastName()
        );

        ApiResponse<CreateRecordResponse> apiResponse = ApiResponse.<CreateRecordResponse>builder()
                .success(true)
                .message(createdRecord.getId() + ": " + createdRecord.getLastName() + " Created")
                .data(createResponse)
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }


}
