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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;

    @Override
    public Page<Record> getRecords(Boolean isResident, String search, Pageable pageable) {
        Pageable fixedPageable = PageRequest.of(
                pageable.getPageNumber(),
                10,
                Sort.by(Sort.Direction.ASC, "lastName")
        );

        return recordRepository.findAllWithFilters(isResident, search, fixedPageable);
    }

    @Override
    @Transactional
    public Record createRecord(CreateRecordRequest request) {
        String firstName = request.getFirstName().toUpperCase();
        String middleName = request.getMiddleName().toUpperCase();
        String lastName = request.getLastName().toUpperCase();
        if(isRecordExistsByName(firstName, middleName, lastName)) {
            throw new RecordAlreadyExistsException("Record with the full name already exists");
        }

        String suffix = request.getSuffix() != null ? request.getSuffix().toUpperCase() : null;

        Record newRecord = Record.builder()
                .firstName(firstName)
                .middleName(middleName)
                .lastName(lastName)
                .suffix(suffix)
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

        boolean isNameChanged =
                !record.getFirstName().equals(request.getFirstName()) ||
                !record.getMiddleName().equals(request.getMiddleName()) ||
                !record.getLastName().equals(request.getLastName());

        if (isNameChanged &&
                recordRepository.existsByFirstNameAndMiddleNameAndLastName(
                        request.getFirstName(),
                        request.getMiddleName(),
                        request.getLastName())) {

            throw new RecordAlreadyExistsException("Record with the full name already exists.");
        }

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
    public Record lookupRecord(String lastName, String firstName) {
        if(firstName != null) {
            return recordRepository.findByLastNameIgnoreCaseAndFirstNameIgnoreCase(lastName, firstName)
                    .orElseThrow(() -> new RecordNotFoundException("Record not found with name: " + lastName + " " + firstName));
        }

        List<Record> foundRecords = recordRepository.findByLastNameIgnoreCase(lastName);
        if(foundRecords.isEmpty()) {
            throw new RecordNotFoundException("Record not found with last name: " + lastName);
        }

        if(foundRecords.size() > 1) {
            throw new MultipleRecordsFoundException("Many Records found with last name: " + lastName + ". Please provide your Record ID.");
        }

        return foundRecords.getFirst();
    }

    @Override
    public String downloadRecords(Boolean isResident) throws IOException {
        List<Record> records = recordRepository.findByIsResident(isResident);

        StringBuilder sb = new StringBuilder();
        sb.append("id,last_name,first_name,middle_name,suffix,birth_date,gender,is_resident,address,points,contact_number,version,updated_at,created_at\n");

        for (Record r : records) {
            sb.append(r.getId()).append(",")
                    .append(r.getLastName()).append(",")
                    .append(r.getFirstName()).append(",")
                    .append(r.getMiddleName()).append(",")
                    .append(r.getSuffix()).append(",")
                    .append(r.getBirthDate()).append(",")
                    .append(r.getGender()).append(",")
                    .append(r.getIsResident()).append(",")
                    .append(r.getAddress()).append(",")
                    .append(r.getPoints()).append(",")
                    .append(r.getContactNumber()).append(",")
                    .append(r.getVersion()).append(",")
                    .append(r.getUpdatedAt()).append(",")
                    .append(r.getCreatedAt())
                    .append("\n");
        }

        return sb.toString();
    }

    private boolean isRecordExistsByName(String firstName, String middleName, String lastName) {
        return recordRepository.existsByFirstNameAndMiddleNameAndLastName(firstName, middleName, lastName);
    }
}
