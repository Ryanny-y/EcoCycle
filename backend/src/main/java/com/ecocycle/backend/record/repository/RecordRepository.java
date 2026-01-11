package com.ecocycle.backend.record.repository;

import com.ecocycle.backend.record.model.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RecordRepository extends JpaRepository<Record, UUID>, PagingAndSortingRepository<Record, UUID> {

    boolean existsByFirstNameAndMiddleNameAndLastName(String firstName, String middleName, String lastName);

    @Query("""
        SELECT r FROM Record r
        WHERE (:isResident IS NULL OR r.isResident = :isResident)
          AND (:firstName IS NULL OR LOWER(r.firstName) LIKE LOWER(%:firstName%))
          AND (:middleName IS NULL OR LOWER(r.middleName) LIKE LOWER(%:middleName%))
          AND (:lastName IS NULL OR LOWER(r.lastName) LIKE LOWER(%:lastName%))
    """)
    Page<Record> findAllWithFilters(
            @Param("isResident") Boolean isResident,
            @Param("firstName") String firstName,
            @Param("middleName") String middleName,
            @Param("lastName") String lastName,
            Pageable pageable
    );

}
