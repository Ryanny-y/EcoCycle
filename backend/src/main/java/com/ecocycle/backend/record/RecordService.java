package com.ecocycle.backend.record;

import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface RecordService {
    Page<Record> getRecords(Boolean isResident, String firstNName, String middleName, String lastName, Pageable pageable);
    Record createRecord(CreateRecordRequest request);
    Record updateRecord(UUID id, UpdateRecordRequest request);
    Record getRecordById(UUID id);
    Record deleteRecord(UUID id);

}
