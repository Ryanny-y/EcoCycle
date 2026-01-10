package com.ecocycle.backend.record.repository;

import com.ecocycle.backend.record.domain.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RecordRepository extends JpaRepository<Record, UUID> {

    boolean existsByFirstNameAndMiddleNameAndLastName(String firstName, String middleName, String lastName);
}
