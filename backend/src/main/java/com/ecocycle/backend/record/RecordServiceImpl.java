package com.ecocycle.backend.record;

import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.exceptions.RecordNotFound;
import com.ecocycle.backend.record.model.Record;
import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.exceptions.RecordAlreadyExists;
import com.ecocycle.backend.record.repository.RecordRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;

    @PersistenceContext
    private EntityManager entityManager;

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

        Record saved = recordRepository.saveAndFlush(newRecord);
        entityManager.refresh(saved);
        return saved;
    }

    @Override
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
                .orElseThrow(() -> new RecordNotFound("Record not found with ID: " + id));
    }

    private boolean isRecordExistsByName(String firstName, String middleName, String lastName) {
        return recordRepository.existsByFirstNameAndMiddleNameAndLastName(firstName, middleName, lastName);
    }

}
