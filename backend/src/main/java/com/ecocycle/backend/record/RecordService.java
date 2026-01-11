package com.ecocycle.backend.record;

import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecordService {
    Page<Record> getRecords(Boolean isResident, String firstNName, String middleName, String lastName, Pageable pageable);
    Record createRecord(CreateRecordRequest request);
}
