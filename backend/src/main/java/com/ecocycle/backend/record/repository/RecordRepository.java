package com.ecocycle.backend.record.repository;

import com.ecocycle.backend.record.model.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecordRepository extends JpaRepository<Record, UUID>, PagingAndSortingRepository<Record, UUID> {

    boolean existsByFirstNameAndMiddleNameAndLastName(String firstName, String middleName, String lastName);

    @Query("""
        SELECT r FROM Record r
        WHERE (:isResident IS NULL OR r.isResident = :isResident)
          AND (:search IS NULL OR
             LOWER(
                 CONCAT(
                     CONCAT(
                         CONCAT(r.lastName, ', '),
                         r.firstName
                     ),
                     r.middleName
             )
         ) ILIKE %:search%)
    """)
    Page<Record> findAllWithFilters(
            @Param("isResident") Boolean isResident,
            @Param("search") String search,
            Pageable pageable
    );

    Optional<Record> findByLastNameIgnoreCaseAndFirstNameIgnoreCase(String lastName, String firstName);

    List<Record> findByLastNameIgnoreCase(String lastName);
}
