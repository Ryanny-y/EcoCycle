package com.ecocycle.backend.record;

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

    private boolean isRecordExistsByName(String firstName, String middleName, String lastName) {
        return recordRepository.existsByFirstNameAndMiddleNameAndLastName(firstName, middleName, lastName);
    }
}
