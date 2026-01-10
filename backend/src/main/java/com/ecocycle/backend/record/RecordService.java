package com.ecocycle.backend.record;

import com.ecocycle.backend.record.domain.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;

public interface RecordService {
    Record createRecord(CreateRecordRequest request);
}
