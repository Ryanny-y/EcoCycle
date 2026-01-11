package com.ecocycle.backend.record.repository;

import com.ecocycle.backend.TestDataUtils;
import com.ecocycle.backend.record.model.Record;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class RecordRepositoryIntegrationTests {

    private final RecordRepository underTest;

    @Autowired
    public RecordRepositoryIntegrationTests(RecordRepository recordRepository) {
        this.underTest = recordRepository;
    }

    @Test
    public void testThatCanCreateAndFindAllWithFilter() {
        Record recordA = TestDataUtils.createRecordA();
        Record recordB = TestDataUtils.createRecordB();
        Record recordC = TestDataUtils.createRecordC();
        Record recordD = TestDataUtils.createRecordD();

        underTest.saveAll(List.of(recordA, recordB, recordC, recordD));

        Pageable pageTest = PageRequest.of(0, 10);
        Page<Record> result1 = underTest.findAllWithFilters(true, null, null, null, pageTest);
        assertThat(result1)
                .hasSize(3)
                .containsExactlyInAnyOrder(recordA, recordC, recordD);

        Page<Record> result2 = underTest.findAllWithFilters(null, "Maria", null, null, pageTest);
        assertThat(result2.getContent())
                .hasSize(2)
                .containsExactlyInAnyOrder(recordB, recordD);

        Page<Record> result3 = underTest.findAllWithFilters(null, null, "Santos", null, pageTest);
        assertThat(result3.getContent())
                .hasSize(2)
                .containsExactlyInAnyOrder(recordA, recordD);

        Page<Record> result4 = underTest.findAllWithFilters(null, null, null, "Mendoza", pageTest);
        assertThat(result4.getContent())
                .hasSize(2)
                .containsExactlyInAnyOrder(recordC, recordD);

        Page<Record> result5 = underTest.findAllWithFilters(recordD.getIsResident(), recordD.getFirstName(), recordD.getMiddleName(), recordD.getLastName(), pageTest);
        assertThat(result5.getContent())
                .hasSize(1)
                .containsExactly(recordD);
    }


}
