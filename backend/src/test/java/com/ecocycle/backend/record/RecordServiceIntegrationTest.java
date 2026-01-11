package com.ecocycle.backend.record;

import com.ecocycle.backend.record.dto.request.CreateRecordRequest;
import com.ecocycle.backend.record.dto.request.UpdateRecordRequest;
import com.ecocycle.backend.record.exceptions.RecordAlreadyExists;
import com.ecocycle.backend.record.exceptions.RecordNotFound;
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
public class RecordServiceIntegrationTest {

    private final RecordService recordService;

    @Autowired
    RecordServiceIntegrationTest(RecordService recordService) {
        this.recordService = recordService;
    }

    @Test
    void createRecord_shouldPersistRecord() {
        CreateRecordRequest request = createRecordRequest();

        Record created = recordService.createRecord(request);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getFirstName()).isEqualTo("Juan");
    }

    @Test
    void createRecord_shouldThrowWhenDuplicateExists() {
        CreateRecordRequest request = createRecordRequest();

        recordService.createRecord(request);

        assertThatThrownBy(() -> recordService.createRecord(request))
            .isInstanceOf(RecordAlreadyExists.class)
            .hasMessage("Record with the full name already exists");
    }

    @Test
    void getRecordById_shouldReturnRecord() {
        CreateRecordRequest request = createRecordRequest();

        Record created = recordService.createRecord(request);

        Record fetched = recordService.getRecordById(created.getId());

        assertThat(fetched.getCode()).isEqualTo("BT-0001");
        assertThat(fetched.getFirstName()).isEqualTo("Juan");
    }

    @Test
    void getRecordById_shouldThrowWhenNotFound() {
        UUID randomId = UUID.randomUUID();

        assertThatThrownBy(() -> recordService.getRecordById(randomId))
            .isInstanceOf(RecordNotFound.class)
            .hasMessage("Record not found with ID: " + randomId);
    }

    @Test
    void updateRecord_shouldUpdateFields() {
        CreateRecordRequest request = createRecordRequest();

        Record created = recordService.createRecord(request);

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

        Record updated = recordService.updateRecord(created.getId(), updateRequest);

        assertThat(updated.getFirstName()).isEqualTo("Juan Updated");
        assertThat(updated.getAddress()).isEqualTo("Updated Address");
        assertThat(updated.getContactNumber()).isEqualTo("09000000000");
        assertThat(updated.getIsResident()).isFalse();
    }

    @Test
    void getRecords_shouldApplyFiltersAndPagination() {
        recordService.createRecord(new CreateRecordRequest(
                "Juan", "Santos", "Dela Cruz",
                null, LocalDate.now(), Gender.MALE, true, "QC", "1"
        ));
        recordService.createRecord(new CreateRecordRequest(
                "Maria", "Lopez", "Reyes",
                null, LocalDate.now(), Gender.FEMALE, false, "Cebu", "2"
        ));
        recordService.createRecord(new CreateRecordRequest(
                "Maria", "Santos", "Mendoza",
                null, LocalDate.now(), Gender.FEMALE, true, "Davao", "3"
        ));

        Page<Record> result = recordService.getRecords(
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

}
