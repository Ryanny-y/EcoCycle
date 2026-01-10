package com.ecocycle.backend.record;

import com.ecocycle.backend.record.domain.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.exceptions.RecordAlreadyExists;
import com.ecocycle.backend.record.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;

    @Override
    public Record createRecord(CreateRecordRequest request) {
        if(isRecordExistsByName(request.getFirstName(), request.getMiddleName(), request.getLastName())) {
            throw new RecordAlreadyExists("Record with the full name already exists");
        }

        Record newRecord = Record.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .suffix(request.getSuffix())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .isResident(request.getIsResident())
                .address(request.getAddress())
                .contactNumber(request.getContactNumber())
                .build();

        return recordRepository.save(newRecord);
    }


    private boolean isRecordExistsByName(String firstName, String middleName, String lastName) {
        return recordRepository.existsByFirstNameAndMiddleNameAndLastName(firstName, middleName, lastName);
    }
}
