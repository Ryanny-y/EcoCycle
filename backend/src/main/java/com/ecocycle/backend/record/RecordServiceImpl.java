package com.ecocycle.backend.record;

import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.exceptions.MultipleRecordsFoundException;
import com.ecocycle.backend.record.exceptions.RecordNotFoundException;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.exceptions.RecordAlreadyExistsException;
import com.ecocycle.backend.record.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;

    @Override
    public Page<Record> getRecords(Boolean isResident, String firstNName, String middleName, String lastName, Pageable pageable) {
        Pageable fixedPageable = PageRequest.of(
                pageable.getPageNumber(),
                10,
                pageable.getSort()
        );

        return recordRepository.findAllWithFilters(isResident, firstNName, middleName, lastName, fixedPageable);
    }

    @Override
    @Transactional
    public Record createRecord(CreateRecordRequest request) {
        if(isRecordExistsByName(request.getFirstName(), request.getMiddleName(), request.getLastName())) {
            throw new RecordAlreadyExistsException("Record with the full name already exists");
        }

        String generatedCode = this.generateCode();
        Record newRecord = Record.builder()
                .code(generatedCode)
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

    @Override
    @Transactional
    public Record updateRecord(UUID id, UpdateRecordRequest request) {
        Record record = getRecordById(id);

        record.setFirstName(request.getFirstName());
        record.setMiddleName(request.getMiddleName());
        record.setLastName(request.getLastName());
        record.setSuffix(request.getSuffix());
        record.setBirthDate(request.getBirthDate());
        record.setGender(request.getGender());
        record.setIsResident(request.getIsResident());
        record.setAddress(request.getAddress());
        record.setContactNumber(request.getContactNumber());

        return recordRepository.save(record);
    }

    @Override
    public Record getRecordById(UUID id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Record not found with ID: " + id));
    }

    @Override
    @Transactional
    public Record deleteRecord(UUID id) {
        Record record = getRecordById(id);
        recordRepository.delete(record);
        return record;
    }

    @Override
    public Record lookupRecord(String lastName, String code) {
        if(code != null) {
            return recordRepository.findByLastNameAndCode(lastName, code)
                    .orElseThrow(() -> new RecordNotFoundException("Record not found with last name: " + lastName + " and ID: " + code));
        }

        List<Record> foundRecords = recordRepository.findByLastName(lastName);
        if(foundRecords.isEmpty()) {
            throw new RecordNotFoundException("Record not found with last name: " + lastName);
        }

        if(foundRecords.size() > 1) {
            throw new MultipleRecordsFoundException("Many Records found with last name: " + lastName + ". Please provide your Record ID.");
        }

        return foundRecords.getFirst();
    }

    private boolean isRecordExistsByName(String firstName, String middleName, String lastName) {
        return recordRepository.existsByFirstNameAndMiddleNameAndLastName(firstName, middleName, lastName);
    }

    private String generateCode() {
        long next = recordRepository.nextCodeSequence();
        return "BT-" + String.format("%04d", next);
    }
}
