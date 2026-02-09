package com.ecocycle.backend.record;

import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.exceptions.MultipleRecordsFoundException;
import com.ecocycle.backend.record.exceptions.RecordAlreadyExistsException;
import com.ecocycle.backend.record.exceptions.RecordNotFoundException;
import com.ecocycle.backend.record.model.Gender;
import com.ecocycle.backend.record.model.Record;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
public class RecordServiceIntegrationTests {

    @Autowired
    private RecordService underTest;

    @Test
    void createRecord_shouldPersistRecord() {
        CreateRecordRequest request = createRecordRequest();

        Record created = underTest.createRecord(request);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getFirstName()).isEqualTo("Juan");
    }

    @Test
    void createRecord_shouldThrowWhenDuplicateExists() {
        CreateRecordRequest request = createRecordRequest();

        underTest.createRecord(request);

        assertThatThrownBy(() -> underTest.createRecord(request))
            .isInstanceOf(RecordAlreadyExistsException.class)
            .hasMessage("Record with the full name already exists");
    }

    @Test
    void getRecordById_shouldReturnRecord() {
        CreateRecordRequest request = createRecordRequest();

        Record created = underTest.createRecord(request);

        Record fetched = underTest.getRecordById(created.getId());

        assertThat(fetched.getFirstName()).isEqualTo("Juan");
    }

    @Test
    void getRecordById_shouldThrowWhenNotFound() {
        UUID randomId = UUID.randomUUID();

        assertThatThrownBy(() -> underTest.getRecordById(randomId))
            .isInstanceOf(RecordNotFoundException.class)
            .hasMessage("Record not found with ID: " + randomId);
    }

    @Test
    void updateRecord_shouldUpdateFields() {
        CreateRecordRequest request = createRecordRequest();

        Record created = underTest.createRecord(request);

        UpdateRecordRequest updateRequest = new UpdateRecordRequest(
                "Juan Updated",
                "Santos",
                "Dela Cruz",
                "Jr",
                created.getBirthDate(),
                created.getGender(),
                false,
                "Updated Address",
                "09000000000"
        );

        Record updated = underTest.updateRecord(created.getId(), updateRequest);

        assertThat(updated.getFirstName()).isEqualTo("Juan Updated");
        assertThat(updated.getAddress()).isEqualTo("Updated Address");
        assertThat(updated.getContactNumber()).isEqualTo("09000000000");
        assertThat(updated.getIsResident()).isFalse();
    }

    @Test
    void getRecords_shouldApplyFiltersAndPagination() {
        underTest.createRecord(new CreateRecordRequest(
                "Juan", "Santos", "Dela Cruz",
                null, LocalDate.now(), Gender.MALE, true, "QC", "1"
        ));
        underTest.createRecord(new CreateRecordRequest(
                "Maria", "Lopez", "Reyes",
                null, LocalDate.now(), Gender.FEMALE, false, "Cebu", "2"
        ));
        underTest.createRecord(new CreateRecordRequest(
                "Maria", "Santos", "Mendoza",
                null, LocalDate.now(), Gender.FEMALE, true, "Davao", "3"
        ));

        Page<Record> result = underTest.getRecords(
                true,
                "Maria",
                null,
                null,
                PageRequest.of(0, 10)
        );

        assertThat(result.getContent())
                .hasSize(1)
                .allMatch(r -> r.getFirstName().equals("Maria"))
                .allMatch(Record::getIsResident);
    }

    @Test
    void deleteRecord_shouldDeleteRecord() {
        Record created = underTest.createRecord(createRecordRequest());

        Record deleted = underTest.deleteRecord(created.getId());

        assertThat(deleted.getId()).isEqualTo(created.getId());

        assertThatThrownBy(() -> underTest.getRecordById(created.getId()))
                .isInstanceOf(RecordNotFoundException.class);
    }

    @Test
    void lookupRecord_withLastNameAndFirstName_shouldReturnMatchingRecord() {
        Record created = underTest.createRecord(createRecordRequest());
        Record result = underTest.lookupRecord("Dela Cruz", created.getFirstName());

        assertThat(result.getId()).isEqualTo(created.getId());
        assertThat(result.getFirstName()).isEqualTo(created.getFirstName());
    }

    @Test
    void lookupRecord_withLastNameOnly_andNoRecord_shouldThrowNotFound() {
        assertThatThrownBy(() -> underTest.lookupRecord("Ramos", null))
                .isInstanceOf(RecordNotFoundException.class);
    }

    @Test
    void lookupRecord_withLastNameOnly_andMultipleRecords_shouldThrowMultipleFound() {
        underTest.createRecord(createRecordRequest());
        underTest.createRecord(createRecordRequestB());

        assertThatThrownBy(() -> underTest.lookupRecord("Dela Cruz", null))
                .isInstanceOf(MultipleRecordsFoundException.class);
    }

    private static CreateRecordRequest createRecordRequest() {
        return new CreateRecordRequest(
                "Juan",
                "Santos",
                "Dela Cruz",
                "Jr",
                LocalDate.of(1995, 6, 15),
                Gender.MALE,
                true,
                "Quezon City",
                "09123456789"
        );
    }

    private static CreateRecordRequest createRecordRequestB() {
        return new CreateRecordRequest(
                "Michael",
                "Santos S",
                "Dela Cruz",
                "Sr.",
                LocalDate.of(1995, 6, 15),
                Gender.MALE,
                true,
                "Quezon City",
                "09123456789"
        );
    }
}
